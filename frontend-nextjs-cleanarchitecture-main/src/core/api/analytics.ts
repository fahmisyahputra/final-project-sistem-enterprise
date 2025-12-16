import { apiClient } from './client';
import { EvolutionMetric, RoleInteraction, UserCollaboration, BPMNData, MonthlyInteraction, Entity, OvertimeRisk, ProjectDuration, HandoverFlow, UtilizationMetric } from '@/core/types/analytics';

export const analyticsApi = {
    getOrganizationEvolution: async (params: { start_month: string; end_month: string }) => {
        const response = await apiClient.get<EvolutionMetric>('/organization/evolution', { params });
        return response.data;
    },

    getOrganizationEvolutionTrend: async (params: { start_month: string; end_month: string }) => {
        const response = await apiClient.get<EvolutionMetric[]>('/organization/evolution-trend', { params });
        return response.data;
    },

    getRoleInteractions: async () => {
        const response = await apiClient.get<RoleInteraction[]>('/roles/interactions');
        return response.data;
    },

    getTopRoleInteractions: async (limit: number = 10) => {
        const response = await apiClient.get<RoleInteraction[]>('/roles/top-interactions', { params: { limit } });
        return response.data;
    },

    getUserCollaboration: async (month: string) => {
        const response = await apiClient.get<UserCollaboration[]>('/users/collaboration', { params: { month } });
        return response.data;
    },

    getBPMNData: async () => {
        const response = await apiClient.get<BPMNData>('/bpmn/data');
        return response.data;
    },

    getInteractionsTrend: async (year?: string) => {
        const params = year ? { year } : {};
        const response = await apiClient.get<MonthlyInteraction[]>('/organization/interactions-trend', { params });
        return response.data;
    },

    getAllRoles: async () => {
        const response = await apiClient.get<Entity[]>('/roles/all');
        return response.data;
    },

    getAllUsers: async () => {
        const response = await apiClient.get<Entity[]>('/users/all');
        return response.data;
    },

    getOvertimeRisk: async () => {
        const response = await apiClient.get<OvertimeRisk[]>('/organization/overtime');
        return response.data;
    },

    getProjectDurations: async () => {
        const response = await apiClient.get<ProjectDuration[]>('/organization/project-durations');
        return response.data;
    },

    getAverageProjectDuration: async () => {
        const response = await apiClient.get<number>('/organization/project-durations/average');
        return response.data;
    },

    getHandoverFlow: async () => {
        const response = await apiClient.get<HandoverFlow[]>('/organization/handovers');
        return response.data;
    },

    getResourceUtilization: async () => {
        const response = await apiClient.get<UtilizationMetric[]>('/organization/utilization');
        return response.data;
    },
};
