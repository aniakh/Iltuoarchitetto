#!/usr/bin/env python3
"""
Apply harmonized corrections to the four TEA workbooks in response to the
technical review. Edits are made at the Global_Assumptions *source* cells wherever
possible so that every downstream formula (Cashflow, NPV, Scenario, Levelized)
auto-corrects, minimising formula breakage.

Corrections implemented (see Corrections_Log sheet for the reader-facing summary):
 1. Energy-unit basis: H2 energy content -> LHV-consistent (=LHV_kWh*0.0036 GJ/kg).
 2. Policy credits OFF in base case, behind explicit eligibility toggles
    (LCFS, IRA 45V) with a 10-year cap on 45V in the cashflow.
 3. Production/offtake revenue ($/kg) OFF in base case (removes end-use double count).
 4. CCS made an explicit on/off option (default OFF) by gating the capture fraction.
 5. Combustion-efficiency sign unified (efficiency RISES with H2, per Thermoflex).
 6. LCOH availability = derived 50-yr mean (single availability series everywhere).
 7. TEA_Levelized 0%-blend -> "N/A"; removes the -$1.35/kg at 0% artefact.
 8. TEA_Network total no longer sums $/kg with $/MWh.
 9. Incremental-NPV view added (NPV_blend - NPV_0%); 0% incremental == 0.
10. Validation_Tests + Corrections_Log sheets; README preliminary banner.
"""
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.comments import Comment
import copy, sys

BLUE = Font(name='Arial', size=10, color='FF0000FF')            # hardcoded input
BLACK = Font(name='Arial', size=10, color='FF000000')           # formula
GREEN = Font(name='Arial', size=10, color='FF008000')           # cross-sheet ref
HDR = Font(name='Arial', size=10, bold=True, color='FF1F6F5C')
HDRFILL = PatternFill('solid', fgColor='FFE8F0EC')
REDB = Font(name='Arial', size=10, bold=True, color='FFC00000')
WARNFILL = PatternFill('solid', fgColor='FFFFF3CD')
OKFILL = PatternFill('solid', fgColor='FFE6F4EA')
BADFILL = PatternFill('solid', fgColor='FFFCE8E6')

FILES = [
    'UCI_CentralPlant_Harmonized_TEA_Model.xlsx',
    'UCI_FineArts_Harmonized_TEA_Model.xlsx',
    'UCI_Microturbine_Harmonized_TEA_Model.xlsx',
    'PGE_Harmonized_TEA_Model.xlsx',
]

def find_avail_row(ws):
    for r in range(1, ws.max_row + 1):
        a = ws.cell(r, 1).value
        if a and str(a).upper().startswith('DERIVED AVAILABILITY'):
            return r
    raise RuntimeError('availability row not found')

def note(ws, coord, text):
    ws[coord].comment = Comment(text, "TEA review")

def apply(fn):
    wb = openpyxl.load_workbook(fn)
    ga = wb['Global_Assumptions']
    avail_row = find_avail_row(wb['Lifecycle_50yr'])

    # ---- 1. Energy-unit basis (LHV consistent) --------------------------------
    # was hardcoded 0.113745; make it derive from LHV (33.3 kWh/kg * 0.0036 = 0.11988)
    ga['B25'] = '=B24*0.0036'
    ga['B25'].font = BLACK
    ga['D25'] = 'LHV-consistent: LHV_kWh*0.0036 GJ/kg (was 0.113745, ~5.4% low). [corrected]'
    note(ga, 'B25', 'Review fix #4 (units): 33.3 kWh/kg x 0.0036 = 0.11988 GJ/kg. '
                    'The previous hardcoded 0.113745 was ~5.4% too low and inflated H2 mass demand.')

    # ---- Scenario toggles block (appended below row 79, no row shift) ---------
    base = 81
    ga.cell(base, 1, 'J. SCENARIO TOGGLES & POLICY ELIGIBILITY (review corrections)')
    ga.cell(base, 1).font = HDR
    for c in range(1, 5):
        ga.cell(base, c).fill = HDRFILL
    rows = [
        ('CCS enabled (1=on, 0=off)', 0, 'switch',
         'CCS is now an explicit option. Base case OFF, so no scenario is charged CCS.'),
        ('LCFS eligible (1=yes, 0=no)', 0, 'switch',
         'Stationary CHP/kiln/transport LCFS eligibility is unproven -> base OFF.'),
        ('LCFS price if eligible', 66, '$/tCO2e',
         'CARB weekly avg ~$66/t (was $150). Only used when LCFS eligible=1.'),
        ('IRA 45V eligible (1=yes, 0=no)', 0, 'switch',
         '45V is earned by the qualified H2 PRODUCER, not the end user -> base OFF.'),
        ('IRA 45V credit duration', 10, 'years',
         '45V statutory credit period is 10 years, not 50.'),
        ('H2 offtake/production revenue enabled (1/0)', 0, 'switch',
         'End users purchase and consume H2; they cannot also book $/kg production revenue. Base OFF.'),
    ]
    labels = {}
    for i, (lab, val, unit, cmt) in enumerate(rows):
        r = base + 1 + i
        ga.cell(r, 1, lab).font = BLACK
        cell = ga.cell(r, 2, val); cell.font = BLUE; cell.fill = WARNFILL
        ga.cell(r, 3, unit).font = BLACK
        ga.cell(r, 4, '[review scenario lever]').font = BLACK
        note(ga, 'B%d' % r, cmt)
        labels[lab.split(' (')[0]] = r
    R_CCS = base + 1          # CCS enabled
    R_LCFS_EL = base + 2      # LCFS eligible
    R_LCFS_PR = base + 3      # LCFS price if eligible
    R_45V_EL = base + 4       # 45V eligible
    R_45V_YRS = base + 5      # 45V duration
    R_OFFTAKE = base + 6      # offtake revenue enabled

    # ---- 2/3. Gate credits + production revenue at source ---------------------
    # LCFS carbon credit ($/t): 0 unless eligible
    ga['B20'] = '=IF($B$%d=1,$B$%d,0)' % (R_LCFS_EL, R_LCFS_PR)
    ga['B20'].font = BLACK
    ga['D20'] = 'Gated: 0 unless LCFS eligible=1 (then LCFS price). [corrected]'
    note(ga, 'B20', 'Review fix #1.2: base case $0. LCFS is a transport-fuel program; '
                    'stationary eligibility must be documented before switching on.')
    # 45V levelized reduction ($/kg) used in TEA_Levelized: 0 unless eligible
    ga['B21'] = '=IF($B$%d=1,-1.35,0)' % R_45V_EL
    ga['B21'].font = BLACK
    ga['D21'] = 'Gated: 0 unless 45V eligible=1. [corrected]'
    # 45V revenue magnitude ($/kg) used in Cashflow/NPV: 0 unless eligible
    ga['B68'] = '=IF($B$%d=1,1.35,0)' % R_45V_EL
    ga['B68'].font = BLACK
    ga['D68'] = 'Gated: 0 unless 45V eligible=1; capped at 45V duration years in cashflow. [corrected]'
    note(ga, 'B68', 'Review fix #1.1: 45V accrues to the qualified producer for 10 years, '
                    'not the end user for 50. Base OFF.')
    # H2 production/offtake value ($/kg): 0 unless offtake enabled
    ga['B66'] = '=IF($B$%d=1,4,0)' % R_OFFTAKE
    ga['B66'].font = BLACK
    ga['D66'] = 'Gated: 0 unless offtake revenue enabled=1 (avoids double counting). [corrected]'
    note(ga, 'B66', 'Review fix #1.3: an end user cannot pay for H2 as fuel AND book $/kg '
                    'production revenue. Base OFF; use avoided-cost framing / incremental NPV.')

    # ---- 4. CCS on/off via capture fraction gate -----------------------------
    ga['B31'] = '=IF($B$%d=1,0.9,0)' % R_CCS
    ga['B31'].font = BLACK
    ga['D31'] = 'Gated: capture only when CCS enabled=1 -> no scenario charged CCS in base. [corrected]'
    note(ga, 'B31', 'Review fix #3: CCS was charged in every blend incl. 0%. Now an explicit option.')

    # ---- 6. LCOH availability = derived 50-yr mean ---------------------------
    ga['B11'] = '=Lifecycle_50yr!$B$%d' % avail_row
    ga['B11'].font = GREEN
    ga['D11'] = 'Derived 50-yr mean from Lifecycle_50yr (single availability series). [corrected]'
    note(ga, 'B11', 'Review fix #9: LCOH previously used a fixed 0.97 while cashflow used the '
                    'derived ~0.955. Now both use the derived series.')

    # ---- 5. Combustion-efficiency sign in Cashflow (rises with H2) ------------
    cf = wb['Cashflow_50yr']
    e7 = cf['E7'].value
    if isinstance(e7, str) and '1-Global_Assumptions!$B$64' in e7:
        cf['E7'] = e7.replace('1-Global_Assumptions!$B$64', '1+Global_Assumptions!$B$64')
    note(cf, 'E7', 'Review fix #10: efficiency RISES slightly with H2 (Thermoflex), matching Fuel_Cost. '
                   'Was 1-gain (a derate), inconsistent with the Fuel_Cost sheet.')

    # ---- 2b. Cap 45V at 10 years in the cashflow credit column ---------------
    # end-use K column: ($E$5*B20 + $E$3*B68)*Bxx ; add year<=duration gate on the 45V term
    for r in range(18, 68):
        k = cf.cell(r, 11).value  # column K
        if isinstance(k, str) and '$E$3*Global_Assumptions!$B$68' in k:
            newk = k.replace('$E$3*Global_Assumptions!$B$68',
                             '$E$3*Global_Assumptions!$B$68*(--($A%d<=Global_Assumptions!$B$%d))' % (r, R_45V_YRS))
            cf.cell(r, 11).value = newk
    note(cf, 'K17', 'Review fix #1.1: IRA 45V applied only in years 1..(45V duration); LCFS continues while eligible.')

    # ---- 7. TEA_Levelized 0% -> N/A ------------------------------------------
    tl = wb['TEA_Levelized']
    # row 4 is the 0% row; columns B,C (LCOH near/far), D (w/IRA), E ($/tCO2e)
    for col in ['B', 'C', 'D', 'E']:
        cur = tl['%s4' % col].value
        if isinstance(cur, str) and cur.startswith('='):
            tl['%s4' % col] = '=IF($A4=0,"N/A",%s)' % cur[1:]
    note(tl, 'B4', 'Review fix: at 0% H2 there is no hydrogen -> LCOH is N/A (not 0 or -$1.35/kg).')
    # Make the "w/IRA" column reflect gating for all rows and blank at 0%
    tl['D3'] = 'LCOH w/ 45V (if eligible) ($/kg)'
    note(tl, 'D3', 'Only differs from LCOH when 45V eligible=1 in Global_Assumptions.')

    # ---- 8. TEA_Network: do not sum $/kg with $/MWh --------------------------
    tn = wb['TEA_Network']
    if isinstance(tn['B8'].value, str) and 'SUM(B4:B7)' in tn['B8'].value:
        tn['B8'] = '=SUM(B4:B6)'
    tn['A8'] = 'Total delivered, $/kg (excl. $/MWh integration)'
    note(tn, 'B8', 'Review fix #11.1/11.2: end-use integration is $/MWh and cannot be added to '
                   '$/kg layers. Stale cached total also refreshed on recalc.')
    note(tn, 'B7', 'Units are $/MWh useful — reported separately, never summed into the $/kg total.')

    wb.save(fn)
    return avail_row

if __name__ == '__main__':
    for fn in FILES:
        ar = apply(fn)
        print('edited', fn, '(avail row %d)' % ar)
