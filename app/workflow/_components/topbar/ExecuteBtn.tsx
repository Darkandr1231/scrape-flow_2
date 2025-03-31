"use client";

import { RunWorkflow } from '@/actions/workflows/runWorkflow';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { PlayIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

function ExecuteBtn({workflowId}:{workflowId:string}) {
  const generate = useExecutionPlan();
  const {toObject} = useReactFlow();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['execute-workflow', workflowId],
    mutationFn: async (data: { workflowId: string; flowDefinition: string }) => {
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
      toast.success("Execution started", {id: "flow-execution"});
    },
    onError: (error: Error) => {
      toast.error("Something went wrong", {id: "flow-execution"});
    },
  });

  const handleExecute = async () => {
    const plan = generate();
    if (!plan) {
      return;
    }

    await mutateAsync({
      workflowId: workflowId,
      flowDefinition: JSON.stringify(toObject()),
    });
  };

  return (
    <Button 
      variant={"outline"} 
      className="flex items-center gap-2" 
      disabled={isPending}
      onClick={handleExecute}
    >
        <PlayIcon size={16} className="stroke-orange-400" />
        {isPending ? "Executing..." : "Execute"}
    </Button>
  )
}

export default ExecuteBtn