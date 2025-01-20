import { Grid, GridItem } from '@chakra-ui/react';
import CreatePost from './CreatePost';
import FriendList from './FriendList';
import Navbar from './subpages/Navbar'
import PostsList from './PostsList';


const HomePage = () => {
    return (
        <>
            <Navbar />
            <Grid templateColumns='repeat(12, 1fr)' mt='1rem' ml='1rem'>
                <GridItem colSpan={4}>
                    <FriendList />
                </GridItem>
                <GridItem colSpan={4}>
                    <CreatePost />
                    <PostsList />
                </GridItem>
            </Grid>
        </>
    )
}

export default HomePage;