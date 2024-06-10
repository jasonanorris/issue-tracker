import { issueSchema, patchIssueSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import delay from "delay";
import { NextRequest, NextResponse } from "next/server"
import authOptions from "../../../auth/authOptions"
import { getServerSession } from "next-auth";
import { error } from "console";

export async function PATCH(
  request: NextRequest,
  {params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);
    if(!session)
      return NextResponse.json({}, {status: 401});
  
    const body = await request.json();
    const validation = patchIssueSchema.safeParse(body);
    if(!validation.success)
      return NextResponse.json(validation.error.format(), {status: 400})

    const {assignedToUserId, title, description} = body;
    if(assignedToUserId && assignedToUserId !== "null") {
      const user = await prisma.user.findUnique({where: {id: assignedToUserId}})
      if(!user)
        return NextResponse.json({error: 'Invalid user.'}, {status: 400})
    }

    const issue = await prisma.issue.findUnique({
      where: {id: parseInt(params.id)}
    })
    if(!issue)
      return NextResponse.json({error: 'Invalid issue'}, {status: 404});

    const assignedToUserIdNullable = (assignedToUserId === "null") ? null : assignedToUserId;

    const updatedIssue = await prisma.issue.update({
      where: {id: issue.id},
      data: {
        title,
        description,
        assignedToUserId: assignedToUserIdNullable
      }
    });

    return NextResponse.json(updatedIssue);
  }

  export async function DELETE(
    
    request: NextRequest,
    {params}: {params: {id: string}}) {
      const session = await getServerSession(authOptions);
      if(!session)
        return NextResponse.json({}, {status: 401});
      
      const issue = await prisma.issue.findUnique({
        where: {id: parseInt(params.id)}
      })
      if(!issue)
        return NextResponse.json({error: 'Invalid issue'}, {status: 404});

      //await delay(2000);
      await prisma.issue.delete({
        where: {id: issue.id}
      });

      return NextResponse.json({});

    }