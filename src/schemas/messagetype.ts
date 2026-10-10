export type MessageType = "CONNECT" | "PWD" | "CHDIR" | "GETFILES" | "GETDIRS" | "EXIT";
export const MessageType = {
    CONNECT: "CONNECT" as MessageType,
    PWD: "PWD" as MessageType,
    CHDIR: "CHDIR" as MessageType,
    GETFILES: "GETFILES" as MessageType,
    GETDIRS: "GETDIRS" as MessageType,
    EXIT: "EXIT" as MessageType
} as const;