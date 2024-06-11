import prisma from '@/prisma/client';
import { Box, Flex, Grid } from '@radix-ui/themes';
import { notFound } from 'next/navigation';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';
import DeleteIssueButton from './DeleteIssueButton';
import { getServerSession } from 'next-auth';
import authOptions from "../../auth/authOptions"
import AssigneeSelect from './AssigneeSelect';
import { Metadata } from 'next';
import { cache } from 'react';

interface Props {
  params: {id: string}
}

const fetchUser = cache((issueId: number) => prisma.issue.findUnique({where: {id: issueId}}))

const IssueDetailPage = async ({params}: Props) => {
  //if(typeof params.id !== 'number') notFound();

  const session = await getServerSession(authOptions);

  const issue = await fetchUser(parseInt(params.id));

  if(!issue)
    notFound();

  //await delay(500);
  
  return (
    <Grid columns={{initial: "1", sm: "5" }} gap="5">
      <Box className='md:col-span-4'>
        <IssueDetails issue={issue} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <AssigneeSelect issue={issue} />
            <EditIssueButton issueId={issue.id} />
            <DeleteIssueButton issueId={issue.id} />
          </Flex>
        </Box>
        )
      }
    </Grid>
  )
}

export default IssueDetailPage

export async function generateMetadata({ params}: Props){
  const issue = await fetchUser(parseInt(params.id));

  return {
    title: issue?.title,
    description: 'Details of issue ' + issue?.id
  }
}
