# Harmonized H₂ TEA — revision in response to the technical review

**Status: PRELIMINARY · SCREENING ONLY · NON-DECISION-GRADE.**
These revisions fix the boundary, unit, policy and consistency errors identified in
the review so that the *base case* is defensible. They do **not** turn the suite into
an investment-grade model. Do not use LCOH / NPV / abatement-cost figures for
investment decisions or for ranking the sites.

## Files

| File | What it is |
|---|---|
| `UCI_CentralPlant_Harmonized_TEA_Model.xlsx` | End-use CHP (Solar Titan 130) |
| `UCI_Microturbine_Harmonized_TEA_Model.xlsx` | End-use microturbine (Capstone C200) |
| `UCI_FineArts_Harmonized_TEA_Model.xlsx` | End-use kiln (Ward MB200) |
| `PGE_Harmonized_TEA_Model.xlsx` | Transmission pipeline |
| `Harmonized_H2_TEA_Dashboard.html` | Interactive dashboard (self-contained) |
| `apply_corrections.py`, `add_sheets.py` | The exact edits applied (provenance) |

> A separate **SoCalGas** workbook referenced by the review was **not** included in the
> upload set, so only four workbooks + the dashboard were revised.

Every workbook now carries two new sheets — **`Corrections_Log`** and
**`Validation_Tests`** — and a red *PRELIMINARY* banner on the README sheet.

## Opening the workbooks

The workbooks are flagged `fullCalcOnLoad`, so **Excel or LibreOffice recomputes every
formula on open** (headless batch recalculation of the 50-year cashflow + closed-form NPV
tables is prohibitively slow, so cached values are intentionally left to refresh on open).
Open each file once before reading results; the `Validation_Tests` PASS/FAIL cells populate
at that point.

## Corrections applied (base case)

1. **Energy-unit basis (units).** H₂ energy content is now LHV-consistent,
   `=LHV_kWh × 0.0036 = 0.11988 GJ/kg` (was a hardcoded `0.113745`, ~5.4 % low, which
   overstated H₂ mass demand and everything downstream). H₂ demand at 20 % (Central Plant)
   is now **902,164 kg/yr** (was 950,824).
2. **IRA 45V.** Removed from the base case. Behind an eligibility toggle
   (`Global_Assumptions` J-block); accrues to the qualified **producer**, and is **capped at
   10 years** in the cashflow (was applied ~50 yr to the end user). Fixes the −$1.35/kg
   artefact at 0 % blend.
3. **LCFS.** Removed from the base case. Behind an eligibility toggle; the eligible price is
   repriced to CARB-recent **~$66/tCO₂e** (was $150). Stationary CHP / kiln / transport
   eligibility must be documented before switching on.
4. **Offtake / production revenue.** The `$4/kg` end-use "production revenue" is **off** in
   the base case (a consumer cannot pay for H₂ *and* book production revenue). Use the
   incremental-NPV view / avoided-cost framing instead.
5. **CCS.** Now an explicit on/off option (default **off**). Previously CCS cost was charged
   in **every** scenario, including 0 % H₂, which dominated and inflated LCOH — e.g. Central
   Plant 20 % near LCOH falls from **$9.74/kg to ~$3.44/kg** once CCS is no longer forced on.
6. **Combustion-efficiency sign.** Efficiency now rises slightly with H₂ **everywhere**
   (Thermoflex); the `Cashflow_50yr` sheet previously used the opposite sign to `Fuel_Cost`.
7. **Availability.** LCOH now uses the **same derived 50-yr mean** availability as the
   cashflow (was a fixed 0.97 in LCOH vs ~0.955 derived in the cashflow).
8. **LCOH at 0 %.** Shown as **N/A** (no hydrogen exists at 0 % blend).
9. **Network units.** `TEA_Network` total no longer adds `$/kg` layers to a `$/MWh`
   integration term; the stale cached total refreshes on recalculation.
10. **Incremental NPV.** `NPV_Comparison` adds an **incremental-vs-0 %-baseline** column; the
    0 % incremental NPV is zero by construction. Absolute "project" NPV is retained for
    continuity but flagged **non-decision-grade**.

### Scenario toggles (`Global_Assumptions`, section J)

| Cell | Toggle | Base |
|---|---|---|
| `B82` | CCS enabled (1/0) | 0 |
| `B83` | LCFS eligible (1/0) | 0 |
| `B84` | LCFS price if eligible ($/tCO₂e) | 66 |
| `B85` | IRA 45V eligible (1/0) | 0 |
| `B86` | IRA 45V credit duration (yr) | 10 |
| `B87` | H₂ offtake/production revenue enabled (1/0) | 0 |

## Dashboard changes

Same corrections in the `GLOBAL` config (`gj_kg → 0.11988`; `lcfs`, `ptc45v`, `ccs_cap`,
`h2_price → 0`), an H₂-price deck default of `$6/kg`, an LCFS slider defaulting to `$0`, a
red *PRELIMINARY* banner, a "Corrections applied" panel, and caveat notes withdrawing the
non-decision-grade claims (blending-vs-CCS/DAC, compressor-count, "integrity saturates at
20 %", merchant transmission revenue, constant-hazard lifecycle).

## Still preliminary — NOT rebuilt

These require research-grade work beyond a screening spreadsheet and are flagged in-place:

- **Hydraulics / compressors** — `N = max(1, ⌈distance/spacing × flow⌉)` is a screening
  proxy, not compressible pipeline hydraulics; it does not verify delivery pressure or
  compute compressor duty from pressure ratio.
- **Reliability PoF** — cumulative "≥1 functional failure" probabilities, **not** catastrophic
  integrity risk; they must not be read alongside rupture probability.
- **Lifecycle degradation** — constant hazard (exponential), **not** age-dependent
  Weibull/renewal; residual-life figures are indicative only.
- **Pipe integrity** — FCGR step multipliers are a screening model, **not** probabilistic
  fracture mechanics; "integrity saturates at 20 %" is a step-function artefact.
- **CAPEX scaling** — pipeline `$/mile`, the `$2M` skid and compressor costs are not
  size/diameter/pressure/location-specific; small low-utilisation loads (e.g. Fine Arts) are
  fixed-cost-dominated, so their LCOH is a boundary result, not a technology cost.
- **Equipment limits** — the 6.89-bar H₂ partial-pressure rule is an API-617 centrifugal-
  compressor concern, not a universal acceptance criterion.
- **Prices** — H₂, NG and electricity prices are screening placeholders; validate against
  actual bills / tariffs and a dated price deck.
- **Reconciliation** — a single machine-readable engine feeding all deliverables (and the
  missing SoCalGas workbook) remains outstanding.

## Defensible conclusions retained

- **20 vol % H₂ ≈ 7.75 % energy substitution** under the selected heating-value basis.
- Small / low-utilisation end uses suffer severe fixed-cost dilution.
- Higher blends raise volumetric-flow requirements.
- Equipment compatibility must be assessed component by component.
- H₂ leakage belongs in lifecycle GHG accounting.
