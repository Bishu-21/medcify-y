"use server";

import { redis } from "@/lib/cache/redis";

export type WorkflowStatus = "PENDING" | "APPROVED" | "REJECTED";
export type WorkflowPriority = "NORMAL" | "URGENT";
export type WorkflowSource = "voice" | "document" | "signal";

export interface WorkflowItem {
    id: string;
    source: WorkflowSource;
    title: string;
    description: string;
    confidence: number;
    priority: WorkflowPriority;
    status: WorkflowStatus;
    createdAt: number;
    reasoning: string;
    data?: any; // Original extracted data for detail view
}

const QUEUE_KEY = "workflow_queue";

export async function addToWorkflow(item: WorkflowItem) {
    try {
        // LPUSH adds to the beginning of the list
        await redis.lpush(QUEUE_KEY, JSON.stringify(item));
        console.log(`[WORKFLOW_ACTION] Item ${item.id} added from ${item.source}`);
        return { success: true };
    } catch (error) {
        console.error("[WORKFLOW_ERROR] Failed to add item:", error);
        return { success: false, error: "Failed to persist workflow action" };
    }
}

export async function getWorkflowQueue(limit: number = 50): Promise<WorkflowItem[]> {
    try {
        const items = await redis.lrange(QUEUE_KEY, 0, limit - 1);
        return items.map((item: any) => (typeof item === 'string' ? JSON.parse(item) : item));
    } catch (error) {
        console.error("[WORKFLOW_ERROR] Failed to fetch queue:", error);
        return [];
    }
}

export async function getWorkflowCount(): Promise<number> {
    try {
        const items = await getWorkflowQueue();
        return items.filter(i => i.status === "PENDING").length;
    } catch (error) {
        console.error("[WORKFLOW_ERROR] Failed to fetch count:", error);
        return 0;
    }
}

export async function updateWorkflowStatus(id: string, status: WorkflowStatus) {
    try {
        // Note: LPUSH/LINDEX is fine for small queues, but for a real app we'd use a hash or separate set
        // For this hackathon demo, we'll fetch all, update, and re-set (safe for low volume)
        const items = await getWorkflowQueue();
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, status } : item
        );

        // Atomically replace the queue (not ideal for high concurrency but perfect for demo)
        await redis.del(QUEUE_KEY);
        if (updatedItems.length > 0) {
            // Use pipeline for performance if we had many items
            for (const item of updatedItems.reverse()) { // Reverse because LPUSH prepends
                await redis.lpush(QUEUE_KEY, JSON.stringify(item));
            }
        }

        console.log(`[WORKFLOW_ACTION] Item ${id} status updated to ${status}`);
        return { success: true };
    } catch (error) {
        console.error("[WORKFLOW_ERROR] Failed to update status:", error);
        return { success: false };
    }
}
