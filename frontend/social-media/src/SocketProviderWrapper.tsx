import { SocketProvider } from "./SocketContext";

export function SocketProviderWrapper({ children }: { children: React.ReactNode }) {
    return <SocketProvider> { children } </SocketProvider>
}