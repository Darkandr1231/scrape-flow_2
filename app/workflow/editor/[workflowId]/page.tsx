import prisma from '@/lib/prisma';
import { auth } from '@/auth'; 
import React from 'react'
import Editor from '../../_components/Editor';

async function page({params}:{params:{workflowId: string}}) {
    const paramsData = await Promise.resolve(params);
    const {workflowId} = paramsData;
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("unathenticated");
    }

    const userId = session.user.id;

    const workflow = await prisma.workflow.findUnique({
        where: {
            id: workflowId,
            userId,
        }
    })

    if (!workflow) {
        return <div>Workflow not found</div>
    }

  return (
   <Editor workflow={workflow} />
  )
}

export default page