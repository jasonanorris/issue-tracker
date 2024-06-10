import { Skeleton } from '@/app/components';
import { Box, Card, Flex } from '@radix-ui/themes';



const LoadingIssueDetailPage = () => {
  return (
    <Box>
      <Skeleton />
      <Flex className='space-x-3' my="2">
      <Skeleton />
      <Skeleton />
      </Flex>
      <Card className='prose' mt="4">
      <Skeleton count={3} />
      </Card>
    </Box>
  )
}

export default LoadingIssueDetailPage