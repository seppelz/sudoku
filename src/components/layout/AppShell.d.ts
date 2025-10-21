import type { ReactNode } from 'react';
interface AppShellProps {
    headline: string;
    subheadline: string;
    instructions: string;
    ariaLabel: string;
    children: ReactNode;
}
export declare function AppShell({ headline, subheadline, instructions, ariaLabel, children }: AppShellProps): import("react/jsx-runtime").JSX.Element;
export {};
