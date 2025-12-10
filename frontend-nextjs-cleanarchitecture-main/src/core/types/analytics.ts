export interface Entity {
    name: string;
}
export interface EvolutionMetric {
    phase: string;
    active_users: number;
    active_roles: number;
    total_interactions: number;
    top_roles: string[];
}

export interface RoleInteraction {
    role_a: string;
    role_b: string;
    weight: number;
}

export interface UserCollaboration {
    user_a: string;
    role_a: string;
    user_b: string;
    role_b: string;
    weight: number;
    month: string;
}

export interface BPMNData {
    nodes: Array<{ id: string; label: string; type: string }>;
    edges: Array<{ source: string; target: string; label?: string }>;
}

export interface MonthlyInteraction {
    month: string;
    total_interactions: number;
}

export interface OvertimeRisk {
    name: string;
    role: string;
    overtime_count: number;
}

export interface ProjectDuration {
    case_id: string;
    duration_days: number;
}

export interface HandoverFlow {
    source_role: string;
    target_role: string;
    avg_duration: number;
}

export interface UtilizationMetric {
    day: number; // 1-7 (Mon-Sun)
    hour: number; // 0-23
    count: number;
}
