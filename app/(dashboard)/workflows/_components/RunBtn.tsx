"use client";

import { RunWorkflow } from '@/actions/workflows/runWorkflow';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { PlayIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

function RunBtn({workflowId}:{workflowId: string}) {
    const { mutateAsync, isPending } = useMutation({
        mutationKey: ['run-workflow', workflowId],
        mutationFn: async (data: { workflowId: string }) => {
            try {
                await RunWorkflow(data);
            } catch (error: any) {
                if (error?.message?.includes('NEXT_REDIRECT')) {
                    return;
                }
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("Workflow started", {id: workflowId});
        },
        onError: () => {
            toast.error("Something went wrong", {id: workflowId});
        },
    });

    const handleRun = async () => {
        toast.loading("Scheduling run...", {id: workflowId});
        await mutateAsync({
            workflowId,
        });
    };

    return (
        <Button 
            variant={"outline"} 
            size={"sm"} 
            className="flex items-center gap-2" 
            disabled={isPending}
            onClick={handleRun}
        >
            <PlayIcon size={16} />
            {isPending ? "Running..." : "Run"}
        </Button>
    );
}

export default RunBtn