import { AxiosError } from "axios";
import { Socket } from "socket.io-client";

export interface ApiErrorResponse {
  message: string;
  status?: number;
  code?: string;
  errors?: Record<string, string[]>;
}

export type ApiError = AxiosError<ApiErrorResponse>;

export interface ServerToClientEvents {
  users_online: (users: string[]) => void;
  activities: (activities: [string, string][]) => void;
  user_connected: (userId: string) => void;
  user_disconnected: (userId: string) => void;
  receive_message: (message: Message) => void;
  message_sent: (message: Message) => void;
  activity_updated: (data: { userId: string; activity: string }) => void;
}

export interface ClientToServerEvents {
  update_activity: (data: { userId: string; activity: string }) => void;
  user_connected: (userId: string) => void;
  send_message: (data: {
    receiverId: string;
    senderId: string;
    content: string;
  }) => void;
}

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

import type { Message } from "./index";
export type { Message };
