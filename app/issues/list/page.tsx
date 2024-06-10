import React from 'react'
import { Table } from '@radix-ui/themes'
//import Link from '../components/Link'
import prisma from '@/prisma/client';
//import IssueStatusBadge from '../components/IssueStatusBadge';
import { IssueStatusBadge, Link } from '@/app/components';
import delay from 'delay';
import IssueActions from './IssueActions';
import { Issue, Status } from '@prisma/client';
import NextLink from 'next/link';
import { ArrowUpIcon } from '@radix-ui/react-icons';

const IssuesPage = async ({searchParams}: {searchParams: {status: Status, orderBy: keyof Issue}}) => {
  //console.log(searchParams.status);

  const columns: {
    label: string;
    value: keyof Issue;
    className?: string;
  }[] = [
    {label: 'Issue', value: 'title'},
    {label: 'Status', value: 'status', className: "hidden md:table-cell"},
    {label: 'Created', value: 'createdAt', className: "hidden md:table-cell"}
  ];

  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const issues = await prisma.issue.findMany({
    where: {
      status: status
    }
  });
  //await delay(500);

  return (
    <div>
      <IssueActions />
      <Table.Root variant='surface'>
        <Table.Header>
          <Table.Row>
            {columns.map(column =>(
              <Table.ColumnHeaderCell key={column.value} className={column.className}>
                <NextLink href={{
                  query: {...searchParams, orderBy: column.value}
                }}>{column.label}</NextLink>
                {column.value === searchParams.orderBy && <ArrowUpIcon className='inline' />}
              </Table.ColumnHeaderCell>  
            ))}            
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map(issue => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>
                  {issue.title}
                </Link> 
                <div className='block md:hidden'>
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className='hidden md:table-cell'><IssueStatusBadge status={issue.status} /></Table.Cell>
              <Table.Cell className='hidden md:table-cell'>{issue.createdAt.toDateString()}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}

export const dynamic = 'force-dynamic';

export default IssuesPage