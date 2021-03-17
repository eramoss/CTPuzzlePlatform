export function getResearchGroupId(request: any): number {
    return request?.user?.researchGroup?.id
}