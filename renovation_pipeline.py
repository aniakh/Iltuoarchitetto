"""Agentic AI renovation feasibility pipeline prototype.

This module provides a command-line workflow that collects renovation project
inputs and produces a structured feasibility report. AI-heavy steps are
implemented as stubs with clear extension points.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Dict, List, Optional, Sequence


ENERGY_ORDER: List[str] = ["G", "F", "E", "D", "C", "B", "A1", "A2", "A3", "A4"]
STYLE_CHOICES: Sequence[str] = ("Scandinavian", "Industrial", "Minimalist", "Contemporary")


@dataclass
class ProjectMetadata:
    """Basic metadata collected at pipeline start.

    Attributes:
        city: Project location city.
        cap: Postal code (CAP).
        floor_area_m2: Gross or net floor area in square meters.
        current_energy_class: Optional current energy class from A4 to G.
        property_type: Property typology such as apartment or villa.
        scope_level: Renovation scope level, typically "light" or "full".
    """

    city: str
    cap: str
    floor_area_m2: float
    current_energy_class: Optional[str]
    property_type: str
    scope_level: str


@dataclass
class UserRequirements:
    """Functional and project constraints captured from the user.

    Attributes:
        goals: Functional goals list (e.g., open kitchen).
        constraints: Non-negotiable constraints (e.g., do not move structural walls).
        budget_min: Minimum target budget (EUR).
        budget_max: Maximum target budget (EUR).
        timeline_weeks: Required completion timeline in weeks.
    """

    goals: List[str]
    constraints: List[str]
    budget_min: float
    budget_max: float
    timeline_weeks: int


@dataclass
class DesignInputs:
    """Design-related inputs from floor plans, photos, and style preferences."""

    plan_data: Dict
    photos: List[str]
    style: Dict


def _prompt_nonempty(prompt: str) -> str:
    """Prompt until a non-empty value is provided."""

    while True:
        value = input(prompt).strip()
        if value:
            return value
        print("Please provide a value.")


def _parse_csv_list(raw: str) -> List[str]:
    """Parse comma-separated values into a clean list of strings."""

    if not raw.strip():
        return []
    return [item.strip() for item in raw.split(",") if item.strip()]


def collect_project_metadata() -> ProjectMetadata:
    """Collect core project metadata from the CLI user.

    Returns:
        ProjectMetadata: Structured metadata including city, CAP, floor area,
        current energy class, property type, and renovation scope.
    """

    print("\n=== Step 1: Project Metadata ===")
    city = _prompt_nonempty("City: ")
    cap = _prompt_nonempty("CAP (postal code): ")

    while True:
        try:
            floor_area_m2 = float(_prompt_nonempty("Floor area (m²): "))
            if floor_area_m2 <= 0:
                raise ValueError
            break
        except ValueError:
            print("Enter a valid positive number for floor area.")

    energy_input = input("Current energy class (A4-G, optional): ").strip().upper()
    current_energy_class = energy_input if energy_input else None

    property_type = _prompt_nonempty("Property type (e.g., apartment): ")

    while True:
        scope_level = _prompt_nonempty("Scope level (light/full): ").lower()
        if scope_level in {"light", "full"}:
            break
        print("Scope level must be 'light' or 'full'.")

    return ProjectMetadata(
        city=city,
        cap=cap,
        floor_area_m2=floor_area_m2,
        current_energy_class=current_energy_class,
        property_type=property_type,
        scope_level=scope_level,
    )


def process_floor_plan(file_path: str) -> Dict:
    """Stub floor-plan processing function.

    In production, this function would run CV/segmentation models to identify
    rooms, boundaries, and measurements from uploaded plans.

    Args:
        file_path: Path to the user-provided floor plan file.

    Returns:
        Dict: Dummy room segmentation output.
    """

    _ = file_path  # Placeholder until model integration.
    return {"rooms": ["kitchen", "bathroom", "living"], "areas": [15.0, 6.0, 20.0]}


def acquire_floor_plans() -> Dict:
    """Collect floor plan source and return normalized plan data."""

    print("\n=== Step 2: Floor Plans ===")
    while True:
        mode = _prompt_nonempty("Choose input mode ('upload' or 'sketch'): ").lower()
        if mode in {"upload", "sketch"}:
            break
        print("Please type 'upload' or 'sketch'.")

    if mode == "upload":
        path = _prompt_nonempty("Floor plan file path: ")
        return process_floor_plan(path)

    room_names = _parse_csv_list(
        _prompt_nonempty("Enter room names (comma-separated): ")
    )

    areas: List[float] = []
    for room in room_names:
        while True:
            try:
                area = float(_prompt_nonempty(f"Area for {room} (m²): "))
                if area <= 0:
                    raise ValueError
                areas.append(area)
                break
            except ValueError:
                print("Enter a valid positive area.")

    return {"rooms": room_names, "areas": areas}


def embed_style(preferences: Dict) -> Dict:
    """Stub function to embed style preferences.

    In production, this would call an embedding model or multimodal encoder.

    Args:
        preferences: Style preferences and optional references.

    Returns:
        Dict: Placeholder vector/descriptor payload.
    """

    selected = preferences.get("style", "Minimalist")
    descriptor_map = {
        "Scandinavian": [0.9, 0.2, 0.1],
        "Industrial": [0.2, 0.9, 0.3],
        "Minimalist": [0.1, 0.4, 0.9],
        "Contemporary": [0.5, 0.5, 0.5],
    }
    return {
        "style": selected,
        "style_vector": descriptor_map.get(selected, [0.0, 0.0, 0.0]),
        "notes": preferences.get("notes", ""),
    }


def collect_photos_and_style() -> Dict:
    """Collect optional photo file paths and style selection."""

    print("\n=== Step 3: Photos and Style ===")
    photos_raw = input("Optional photo paths (comma-separated, leave blank if none): ")
    photos = _parse_csv_list(photos_raw)

    print("Available styles:")
    for idx, style in enumerate(STYLE_CHOICES, start=1):
        print(f"  {idx}. {style}")

    style_choice = "Minimalist"
    while True:
        raw = _prompt_nonempty("Choose style number: ")
        try:
            index = int(raw) - 1
            style_choice = STYLE_CHOICES[index]
            break
        except (ValueError, IndexError):
            print("Please select a valid style number.")

    notes = input("Any style notes (optional): ").strip()
    style_descriptor = embed_style({"style": style_choice, "notes": notes})

    return {"photos": photos, "style": style_descriptor}


def collect_goals_and_constraints() -> UserRequirements:
    """Capture goals, constraints, budget range, and desired timeline."""

    print("\n=== Step 4: Goals and Constraints ===")
    goals = _parse_csv_list(_prompt_nonempty("Functional goals (comma-separated): "))
    constraints = _parse_csv_list(input("Constraints (comma-separated): "))

    while True:
        try:
            budget_min = float(_prompt_nonempty("Budget minimum (EUR): "))
            budget_max = float(_prompt_nonempty("Budget maximum (EUR): "))
            if budget_min <= 0 or budget_max <= 0 or budget_min > budget_max:
                raise ValueError
            break
        except ValueError:
            print("Enter a valid budget range where min <= max and both are positive.")

    while True:
        try:
            timeline_weeks = int(_prompt_nonempty("Required timeline (weeks): "))
            if timeline_weeks <= 0:
                raise ValueError
            break
        except ValueError:
            print("Enter a positive integer timeline in weeks.")

    return UserRequirements(
        goals=goals,
        constraints=constraints,
        budget_min=budget_min,
        budget_max=budget_max,
        timeline_weeks=timeline_weeks,
    )


def build_digital_twin(plan_data: Dict, photos: List[str], style: Dict, constraints: List[str]) -> Dict:
    """Build a prototype digital twin representation.

    In production, this would merge floor plan segmentation and visual analysis
    from photos into a geometric/semantic twin.

    Args:
        plan_data: Extracted rooms and area measurements.
        photos: Optional site/interior photo paths.
        style: Embedded style descriptor.
        constraints: Project constraints to preserve in downstream generation.

    Returns:
        Dict: Combined twin representation for concept generation.
    """

    return {
        "rooms": plan_data.get("rooms", []),
        "areas": plan_data.get("areas", []),
        "photo_count": len(photos),
        "photo_paths": photos,
        "style": style,
        "constraints": constraints,
    }


def generate_concepts(twin: Dict, style: Dict) -> List[Dict]:
    """Stub concept generation from digital twin and style profile.

    In production, this would call a generative model and attach real renders.
    """

    _ = twin
    s = style.get("style", "Minimalist")
    return [
        {
            "label": "Open Plan Concept",
            "key_moves": [
                "Remove non-load-bearing partition between kitchen and living",
                "Create integrated dining peninsula",
            ],
            "materials_palette": f"{s} palette: light oak parquet, white walls, black fixtures",
            "render_path": "renders/open_plan_concept.png",
        },
        {
            "label": "Privacy Zoning Concept",
            "key_moves": [
                "Reorganize circulation with sliding partitions",
                "Add compact second bathroom near bedroom cluster",
            ],
            "materials_palette": f"{s} palette: warm neutral tiles, matte cabinetry, brushed steel",
            "render_path": "renders/privacy_zoning_concept.png",
        },
        {
            "label": "Storage-First Concept",
            "key_moves": [
                "Introduce full-height built-in storage walls",
                "Optimize utility niche for laundry and HVAC",
            ],
            "materials_palette": f"{s} palette: textured plaster, engineered wood, concealed lighting",
            "render_path": "renders/storage_first_concept.png",
        },
    ]


def estimate_work_package_cost(
    quantity: float,
    unit_price: float,
    alpha_loc: float,
    alpha_overhead: float,
    fixed_cost: float,
) -> float:
    """Estimate one work package cost with multipliers and fixed costs."""

    return (quantity * unit_price) * (1 + alpha_loc) * (1 + alpha_overhead) + fixed_cost


def estimate_total_cost(work_packages: List[float]) -> float:
    """Aggregate work package costs and add VAT."""

    subtotal = sum(work_packages)
    vat_rate = 0.10
    return subtotal * (1 + vat_rate)


def estimate_cost_and_schedule(plan_data: Dict, scope_level: str) -> Dict:
    """Compute parametric cost and schedule ranges.

    Uses placeholder assumptions for unit prices, location multipliers, and
    productivity rates. Cost uncertainty is represented via p10/p50/p90 ranges.

    Args:
        plan_data: Plan data with rooms and areas.
        scope_level: "light" or "full".

    Returns:
        Dict: Cost range, schedule range, detailed assumptions.
    """

    total_area = float(sum(plan_data.get("areas", [])))
    if total_area <= 0:
        total_area = 60.0  # Fallback assumption.

    is_full = scope_level.lower() == "full"

    alpha_loc = 0.08
    alpha_overhead = 0.12

    demolition_cost = estimate_work_package_cost(total_area, 35 if is_full else 12, alpha_loc, alpha_overhead, 900)
    finishes_cost = estimate_work_package_cost(total_area, 220 if is_full else 130, alpha_loc, alpha_overhead, 1800)
    mep_cost = estimate_work_package_cost(total_area, 160 if is_full else 70, alpha_loc, alpha_overhead, 2500)

    package_costs = [demolition_cost, finishes_cost, mep_cost]
    p50 = estimate_total_cost(package_costs)
    p10 = p50 * (1 - 0.15)
    p90 = p50 * (1 + 0.30)

    productivity = {
        "demolition_m2_day": 20 if is_full else 35,
        "finishes_m2_day": 12 if is_full else 18,
        "mep_m2_day": 8 if is_full else 14,
    }

    d_design = 3.0
    d_permits = 4.0
    d_procurement = 2.0

    d_site_days = (
        total_area / productivity["demolition_m2_day"]
        + total_area / productivity["finishes_m2_day"]
        + total_area / productivity["mep_m2_day"]
    )
    d_site_weeks = d_site_days / 5.0

    d_total_weeks = d_design + d_permits + d_procurement + d_site_weeks
    schedule = {
        "p50_weeks": round(d_total_weeks, 1),
        "p10_weeks": round(d_total_weeks * 0.85, 1),
        "p90_weeks": round(d_total_weeks * 1.30, 1),
    }

    return {
        "cost_range_eur": {
            "p10": round(p10, 2),
            "p50": round(p50, 2),
            "p90": round(p90, 2),
        },
        "schedule_range_weeks": schedule,
        "assumptions": {
            "scope_level": scope_level,
            "total_area_m2": total_area,
            "alpha_loc": alpha_loc,
            "alpha_overhead": alpha_overhead,
            "city_multiplier_note": "Default city multiplier embedded in alpha_loc=0.08",
            "durations": {
                "D_design_weeks": d_design,
                "D_permits_weeks": d_permits,
                "D_procurement_weeks": d_procurement,
                "D_site_weeks": round(d_site_weeks, 1),
            },
        },
    }


def classify_permit(goals: List[str], constraints: List[str]) -> str:
    """Classify permit type based on goals and constraints.

    Rules:
      - Routine cosmetic maintenance -> edilizia libera.
      - Interior non-structural layout changes -> CILA.
      - Structural modifications (e.g., load-bearing walls) -> SCIA.
    """

    joined = " ".join(goals + constraints).lower()

    structural_markers = ["load-bearing", "structural", "bearing wall", "wall removal"]
    if any(marker in joined for marker in structural_markers):
        if "do not move load-bearing" not in joined:
            return "SCIA"

    layout_markers = ["open kitchen", "second bathroom", "redistribute", "layout", "partition"]
    if any(marker in joined for marker in layout_markers):
        return "CILA"

    cosmetic_markers = ["painting", "fixtures", "cosmetic", "finish"]
    if any(marker in joined for marker in cosmetic_markers):
        return "edilizia libera"

    return "CILA"


def predict_energy_class(current_class: str, upgrades: List[str]) -> str:
    """Stub energy class predictor for APE class transition.

    APE classes are considered in ascending order G -> ... -> A4.
    If upgrades include insulation or renewable systems, the class improves by
    one or two levels in this prototype model.
    """

    if not current_class:
        return "Unknown"

    normalized = current_class.upper()
    if normalized not in ENERGY_ORDER:
        return normalized

    upgrade_text = " ".join(upgrades).lower()
    step = 0
    if "insulation" in upgrade_text or "cappotto" in upgrade_text:
        step += 1
    if "renewable" in upgrade_text or "photovoltaic" in upgrade_text or "heat pump" in upgrade_text:
        step += 1

    current_idx = ENERGY_ORDER.index(normalized)
    new_idx = min(current_idx + max(step, 0), len(ENERGY_ORDER) - 1)
    return ENERGY_ORDER[new_idx]


def compile_report(
    metadata: Dict,
    selected_concept: Dict,
    estimates: Dict,
    permit: str,
    energy_pred: str,
    requirements: Dict,
    output_path: Optional[str] = None,
) -> None:
    """Compile and print/write final feasibility report.

    Report fields:
        metadata: Core project information (location, area, typology, scope).
        selected_concept: Chosen concept label, key moves, material palette,
            and placeholder render path.
        estimates: Cost p10/p50/p90 and schedule ranges with assumptions.
        permit: Recommended permit class (edilizia libera, CILA, or SCIA).
        energy_pred: Forecast post-renovation energy class.
        requirements: User goals, constraints, budget, and timeline.
        output_path: Optional text file path to persist the report.
    """

    lines = [
        "=" * 70,
        "RENOVATION FEASIBILITY REPORT",
        f"Generated at: {datetime.now().isoformat(timespec='seconds')}",
        "=" * 70,
        "\nPROJECT METADATA",
        f"- City: {metadata.get('city')}",
        f"- CAP: {metadata.get('cap')}",
        f"- Floor area (m²): {metadata.get('floor_area_m2')}",
        f"- Property type: {metadata.get('property_type')}",
        f"- Scope level: {metadata.get('scope_level')}",
        f"- Current energy class: {metadata.get('current_energy_class') or 'Unknown'}",
        "\nSELECTED CONCEPT",
        f"- Label: {selected_concept.get('label')}",
        "- Key moves:",
    ]

    for move in selected_concept.get("key_moves", []):
        lines.append(f"  • {move}")

    lines.extend(
        [
            f"- Materials palette: {selected_concept.get('materials_palette')}",
            f"- Render placeholder: {selected_concept.get('render_path')}",
            "\nESTIMATES",
            f"- Cost range EUR (p10/p50/p90): {estimates['cost_range_eur']}",
            f"- Schedule range weeks (p10/p50/p90): {estimates['schedule_range_weeks']}",
            "\nREGULATORY AND ENERGY",
            f"- Recommended permit type: {permit}",
            f"- Forecast energy class: {energy_pred}",
            "\nUSER REQUIREMENTS",
            f"- Goals: {requirements.get('goals')}",
            f"- Constraints: {requirements.get('constraints')}",
            f"- Budget target EUR: {requirements.get('budget_min')} - {requirements.get('budget_max')}",
            f"- Required timeline (weeks): {requirements.get('timeline_weeks')}",
            "\nNEXT STEPS",
            "1) Validate selected concept with architect/engineer.",
            "2) Launch detailed survey and as-built verification.",
            "3) Confirm permit documentation strategy.",
            "4) Run supplier RFQs to refine cost and schedule.",
            "=" * 70,
        ]
    )

    report_text = "\n".join(lines)
    print("\n" + report_text)

    if output_path:
        with open(output_path, "w", encoding="utf-8") as file:
            file.write(report_text)
        print(f"\nReport written to: {output_path}")


def run_pipeline() -> None:
    """Run the end-to-end renovation feasibility pipeline via CLI.

    Handles exceptions gracefully and reports user-friendly errors while
    preserving modular composition for future integration in web/API flows.
    """

    try:
        metadata = collect_project_metadata()
        plan_data = acquire_floor_plans()
        style_bundle = collect_photos_and_style()
        requirements = collect_goals_and_constraints()

        twin = build_digital_twin(
            plan_data=plan_data,
            photos=style_bundle["photos"],
            style=style_bundle["style"],
            constraints=requirements.constraints,
        )

        concepts = generate_concepts(twin=twin, style=style_bundle["style"])
        print("\n=== Step 5: Generated Concepts ===")
        for idx, concept in enumerate(concepts, start=1):
            print(f"{idx}. {concept['label']}")
            for move in concept["key_moves"]:
                print(f"   - {move}")
            print(f"   - Materials: {concept['materials_palette']}")
            print(f"   - Render: {concept['render_path']}")

        while True:
            choice_raw = _prompt_nonempty("Choose concept to move forward (number): ")
            try:
                chosen_idx = int(choice_raw) - 1
                selected_concept = concepts[chosen_idx]
                break
            except (ValueError, IndexError):
                print("Please choose a valid concept number.")

        estimates = estimate_cost_and_schedule(plan_data=plan_data, scope_level=metadata.scope_level)
        permit = classify_permit(requirements.goals, requirements.constraints)

        upgrades = requirements.goals + selected_concept.get("key_moves", [])
        energy_pred = predict_energy_class(metadata.current_energy_class or "", upgrades)

        output_choice = input("Write report to file? (y/n): ").strip().lower()
        output_path = "feasibility_report.txt" if output_choice == "y" else None

        compile_report(
            metadata=asdict(metadata),
            selected_concept=selected_concept,
            estimates=estimates,
            permit=permit,
            energy_pred=energy_pred,
            requirements=asdict(requirements),
            output_path=output_path,
        )

    except KeyboardInterrupt:
        print("\nPipeline interrupted by user.")
    except Exception as exc:  # Defensive catch for CLI robustness.
        print(f"\nAn error occurred while running the pipeline: {exc}")


if __name__ == "__main__":
    run_pipeline()
