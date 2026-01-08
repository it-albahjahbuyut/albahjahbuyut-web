/**
 * Simple Queue System for Background Processing
 * Mencegah terlalu banyak proses upload bersamaan
 */

type QueueTask = () => Promise<void>;

interface QueueItem {
    id: string;
    task: QueueTask;
    addedAt: Date;
}

class BackgroundQueue {
    private queue: QueueItem[] = [];
    private processing: Set<string> = new Set();
    private maxConcurrent: number;
    private isProcessing: boolean = false;

    constructor(maxConcurrent: number = 3) {
        this.maxConcurrent = maxConcurrent;
    }

    /**
     * Add task to queue
     */
    add(id: string, task: QueueTask): void {
        this.queue.push({
            id,
            task,
            addedAt: new Date()
        });
        console.log(`[Queue] Task ${id} added. Queue size: ${this.queue.length}`);
        this.processNext();
    }

    /**
     * Process next items in queue
     */
    private async processNext(): Promise<void> {
        // Prevent multiple process loops
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.queue.length > 0 && this.processing.size < this.maxConcurrent) {
            const item = this.queue.shift();
            if (!item) continue;

            this.processing.add(item.id);
            console.log(`[Queue] Processing ${item.id}. Active: ${this.processing.size}/${this.maxConcurrent}`);

            // Run task without blocking
            item.task()
                .then(() => {
                    console.log(`[Queue] Task ${item.id} completed`);
                })
                .catch((error) => {
                    console.error(`[Queue] Task ${item.id} failed:`, error);
                })
                .finally(() => {
                    this.processing.delete(item.id);
                    // Continue processing
                    this.processNext();
                });
        }

        this.isProcessing = false;
    }

    /**
     * Get queue status
     */
    getStatus(): { queued: number; processing: number } {
        return {
            queued: this.queue.length,
            processing: this.processing.size
        };
    }
}

// Singleton instance - max 3 concurrent uploads
export const uploadQueue = new BackgroundQueue(3);
