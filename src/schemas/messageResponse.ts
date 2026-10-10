export type MessageResponse = "SUCCESS" | "ERROR";
export const MessageResponse = {
    SUCCESS: "SUCCESS" as MessageResponse,
    ERROR: "ERROR" as MessageResponse
} as const;