export const DEFAULT_GROUP = 'default';

export type GroupColorPair = {
    light: GroupColor;
    dark: GroupColor;
}

export type GroupColor = {
    bgColor: string;
    color: string;
}

export const GROUP_COLORS: GroupColorPair[] = [
    { light: { bgColor: '#F4F6F9', color: '#1E293B' }, dark: { bgColor: '#0F172A', color: '#E2E8F0' } },
    { light: { bgColor: '#F0FDF4', color: '#14532D' }, dark: { bgColor: '#064E3B', color: '#D1FAE5' } },
    { light: { bgColor: '#FAF5FF', color: '#581C87' }, dark: { bgColor: '#2E1065', color: '#F3E8FF' } },
    { light: { bgColor: '#FFF7ED', color: '#7C2D12' }, dark: { bgColor: '#431407', color: '#FFEDD5' } },
    { light: { bgColor: '#FAFAFA', color: '#171717' }, dark: { bgColor: '#171717', color: '#F5F5F5' } }
];

export const DEFAULT_GROUP_COLOR: GroupColorPair = { light: { bgColor: '#F4F4F5', color: '#71717A' }, dark: { bgColor: '#27272A', color: '#A1A1AA' } };
