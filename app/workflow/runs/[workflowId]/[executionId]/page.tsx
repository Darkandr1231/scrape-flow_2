import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { waitFor } from "@/lib/helper/waitFor";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import ExecutionViewer from "./_components/ExecutionViewer";

export default async function ExecutionViewerPage({
    params,
}:{
    params: {
        executionId: string;
        workflowId: string;
    };
}) {
    const paramsData = await Promise.resolve(params);
    const { workflowId, executionId } = paramsData;

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            <Topbar 
                workflowId={workflowId}
                title="Workflow run details"
                subtitle={`RUN ID: ${executionId}`}
                hideButtons
            />
            <section className="flex h-full overflow-auto">
                <Suspense 
                    fallback={
                        <div className="flex w-full 
                        items-center justify-center">
                            <Loader2Icon className="h-10 w-10 animate-spin 
                            stroke-primary" />
                        </div>
                    }
                >
                    <ExecutionViewWrapper executionId={executionId} />
                </Suspense>
            </section>
        </div>
    ); 
}

async function ExecutionViewWrapper({
    executionId,
}:{
    executionId: string;
}) {
    const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
    if (!workflowExecution) {
        return <div>Not found</div>
    }

    return <ExecutionViewer initialData={workflowExecution} />
}