import React, { useEffect } from 'react'
import Navbar from './subpages/Navbar'
import { 
    Button, 
    Card, 
    Grid,
     GridItem, 
     Image, 
     Stack, 
     Flex, 
     Icon, 
     Separator, 
     FileUploadRootProvider, 
     useFileUpload, 
     FileUploadHiddenInput, 
     Editable, 
     IconButton,
     useBreakpointValue,
     Text,
    } from '@chakra-ui/react'
import {
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogContent,
    DialogRoot,
    DialogCloseTrigger,
} from './src/components/ui/dialog'
import {
    FileUploadTrigger
} from './src/components/ui/file-upload'
import { Avatar, AvatarGroup } from './src/components/ui/avatar'
import { MdEdit } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6"
import CreatePost from './CreatePost';
import PostsList from './PostsList';
import { useUserStore } from '../store/user.store';
import { LuMessageCircleMore, LuX } from 'react-icons/lu'
import { AiOutlineUserAdd } from "react-icons/ai";
import { api } from './utils/axiosConfig'
import { useNavigate, useParams } from 'react-router'
import { Post, usePostStore } from '../store/post.store'
import axios from 'axios'
import { Toaster, toaster } from './src/components/ui/toaster'


export interface ErrorResponse {
    name: string,
    message: string,
}

const ProfilePage = () => {
    const navigate = useNavigate()
    const { username } = useParams()
    const { setPosts } = usePostStore()
    const [ previewUrl, setPreviewUrl ] = React.useState<string | null>(null)  
    const [ isEditNameClick, setIsEditNameClick ] = React.useState<boolean>(false)
    const [ isEditBioClick, setIsEditBioClick ] = React.useState<boolean>(false)
    const { userName, userId, bio,  } = useUserStore() || { userName: '', userId: 0, bio: '' }
    const [ newName, setNewName ] = React.useState<string>(userName || '')
    const [ newBio, setNewBio ] = React.useState<string>(bio || 'Gago')
    
    const [ searchedUserProfileData, setSearchedUserProfileData ] = React.useState<{
        id: number,
        username: string,
        profilePicture: string,
        bio: string
        isFriend: {
            id: number | null, 
            status: string | null | boolean,
            receiver: number | null
        } 
    }>({
        id: 0,
        username: '',
        profilePicture: '',
        bio: '',
        isFriend: {
            id: 0,
            status: '',
            receiver: 0
        }
    })

    const [ friendList, setFriends ] = React.useState<{
        id: number | null,
        userName: string | null,
        profilePicture: string | null
    }[]>([])


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userApi = api('user')
                const response = await userApi.get(`/profile/${username}`)
                setSearchedUserProfileData(response.data[0])
            }
            catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const errorResponse = err.response?.data as ErrorResponse;
                    toaster.create({
                        title: errorResponse.name,
                        description: errorResponse.message,
                        type: 'error',
                    })
                }
            }
        }
        fetchUserProfile()
    }, [username, userName])

    useEffect(() => {
        const fetchUserFriends = async (userFilter: number) => {
            try {
                const friendshipApi = api('friendship')
                const response = await friendshipApi.get('/friends', {
                    params: { userId: userFilter }
                })
                setFriends(response.data)
            }
            catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const errorResponse = err.response?.data as ErrorResponse;
                    toaster.create({
                        title: errorResponse.name,
                        description: errorResponse.message,
                        type: 'error',
                    })
                }
            }
        }
        fetchUserFriends(searchedUserProfileData.id)
    }, [searchedUserProfileData.id])

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const userApi = api('user')
                const response = await userApi.get(`/profile/${username}/posts`)
                const updatedPosts = response.data.map((post: Post) => ({
                    ...post,
                    isLiked: post.likes.some((like: { likeId: number, userId: number, createdAt: string }) => like.userId === userId) ? true : false
                }))
            setPosts(updatedPosts)
            }
            catch(err: unknown) {
                if (axios.isAxiosError(err)) {
                    const errorResponse = err.response?.data as ErrorResponse;
                    toaster.create({
                        title: errorResponse.name,
                        description: errorResponse.message,
                        type: 'error',
                    })
                }
                else {
                    console.error(err)
                }
            }
        }
        fetchUserPosts()
    }, [searchedUserProfileData.id])
    

    const fileUpload = useFileUpload({
        maxFiles: 1,
        name: 'profilePicture',
        accept: ['image/png', 'image/jpeg', 'image/jpg'],
        onFileChange (file) {
            if(file) {
                const reader = new FileReader()
                reader.onload = () => {
                    setPreviewUrl(reader.result as string);
                }
                reader.readAsDataURL(file.acceptedFiles[0])
            }
            else {
                setPreviewUrl(null)
            }
        },
    })

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        const file = fileUpload.acceptedFiles[0]
        try {
            const friendShipApi = api('friendship')
            const response = await friendShipApi.patch('/edit-profile', {
                userId, 
                username: newName,
                bio: newBio,
                profilePicture: file
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            alert('Profile updated')
        }
        catch (err) {
            console.error(err)
        }
    }

    const handleAddFriend = async () => {
        try {
            const friendshipApi = api('friendship')
            const response = await friendshipApi.post('/send-friend-request', {
                receiverId: searchedUserProfileData.id,
            })
            alert('Friend request sent')
            const updatedData = { ...searchedUserProfileData, isFriend: { id: response.data.id, receiver: response.data.receiverId, status: response.data.friendshipStatus } }
            setSearchedUserProfileData(updatedData)
        }
        catch (err) {
            console.error(err)
        }
    }
    
    const handleAcceptFriend = async () => {
        try {
            const friendshipApi = api('friendship')
            const response = await friendshipApi.patch('/accept-friend-request', {
                friendshipId: searchedUserProfileData.isFriend.id,
                receiverId: searchedUserProfileData.id
            })
            alert('Friend request accepted')
            const updatedData = { ...searchedUserProfileData, isFriend: { id: response.data.id, receiver: response.data.receiverId, status: response.data.friendshipStatus } }
            setSearchedUserProfileData(updatedData)
        }
        catch (err) {
            console
        }
    }

    const handleCancelRequest = async () => {
        try {
            const friendshipApi = api('friendship')
            const response = await friendshipApi.delete('/decline-friend-request', {
                data: {
                    friendshipId: searchedUserProfileData.isFriend.id,
                    receiverId: searchedUserProfileData.id
                }
            })
            console.log('Friendship id', searchedUserProfileData.isFriend.id)
            alert('Friend request declined')
            const updatedData = { ...searchedUserProfileData, isFriend: { id: response.data.id, receiver: response.data.receiverId, status: response.data.friendshipStatus } }
            setSearchedUserProfileData(updatedData)
        }
        catch (err) {
            console.error(err)
        }
    }

    const handleMessageUser = async () => {
        try {
            const conversationApi = api('conversation')
            const response = await conversationApi.post('/create-conversation', {
                userTwoId: searchedUserProfileData.id
            })
            navigate(`/messages/${response.data.id}`)
        }
        catch(err) {
            console.error(err)
        }
    }

    const isMobile = useBreakpointValue({
        base: true,
        sm: true,
        md: true,
        lg: true,
        tablet: false,
        desktop: false,
        wide: false,
        wideDesktop: false,
    });

    const gridItemColStart = useBreakpointValue({
        base: 1,
        sm: 1,
        md: 1,
        lg: 1,
        tablet: 1,
        desktop: 2,
        wide: 3,
        wideDesktop: 3,
    })

    const gridItemColEnd = useBreakpointValue({
        base: 13,
        sm: 13,
        md: 13,
        lg: 13,
        tablet: 13,
        desktop: 12,
        wide: 11,
        wideDesktop: 11
    })

    const gridGap = useBreakpointValue({
        base: 'rem',
        sm: '1rem',
        md: '1rem',
        lg: '1rem',
        tablet: '25.5rem',
        desktop: '13rem',
        wide: '11.5rem',
        wideDesktop: '11.5rem'
    })

    const leftRightMargin = useBreakpointValue({
        base: '0.5rem',
        sm: '0.5rem',
        md: '0.5rem',
        lg: '0.5rem',
        tablet: '2rem',
        desktop: '10rem',
        wide: '10rem',
        wideDesktop: '19rem'
    })

    const postButtonSize = useBreakpointValue({
        base: '13.5rem',
        sm: '17rem',
        md: '19.5rem',
        lg: '41.5rem',
        tablet: '28rem',
        desktop: '26rem',
        wide: '33rem',
        wideDesktop: '32.5rem'
    })


    return (
        <>
            <Navbar />
           <Grid templateColumns='repeat(12, 1fr)' gap='1rem' mx={leftRightMargin}>
                <GridItem colStart={gridItemColStart} colEnd={gridItemColEnd}>
                    <Card.Root p='3rem' unstyled w='100%'>
                        <Card.Body>
                            <Stack direction={!isMobile ? 'row' : 'column'} gap='1rem' align='center'>
                                <Image 
                                src={ !searchedUserProfileData.profilePicture ? 'https://bit.ly/ryan-florence' : searchedUserProfileData.profilePicture } 
                                borderRadius='full' boxSize='10rem' css={{ outlineWidth: '4px', outlineColor: 'gray.300', outlineOffset: '1px', outlineStyle: 'solid' }} 
                                />
                                <Stack direction='column'>
                                    
                                </Stack>
                                <Stack direction='column' align={!isMobile ? 'flex-start' : 'center'} gap='0.2rem'>
                                    <Card.Title fontSize='2.2rem' fontWeight='bold'> { !searchedUserProfileData.username ? userName : searchedUserProfileData.username } </Card.Title>
                                    <Card.Description fontSize='1.1rem' color='gray.500' fontWeight='medium' > { friendList.length } { friendList.length > 1 ? 'friends' : 'friend' }</Card.Description>
                                    {!isMobile ? null : (
                                        <AvatarGroup>
                                        {(searchedUserProfileData.isFriend.status === true || searchedUserProfileData.isFriend.status === 'accepted') && friendList.map((friend, index) => (
                                            <Avatar src={friend.profilePicture || 'https://bit.ly/sage-adebayo'} name={friend.userName || 'Gago'} key={index} />
                                        ))}
                                        </AvatarGroup>
                                    )}
                                    <Stack direction='row' gap={gridGap} mt={!isMobile ? '0' : '1rem'}>
                                        {!isMobile ? (
                                            <AvatarGroup>
                                                {(searchedUserProfileData.isFriend.status === true || searchedUserProfileData.isFriend.status === 'accepted') && friendList.map((friend, index) => (
                                                    <Avatar src={friend.profilePicture || 'https://bit.ly/sage-adebayo'} name={friend.userName || 'Gago'} key={index} />
                                                ))}
                                            </AvatarGroup>
                                        ) : null}
                                        <Stack direction='row' gap='2' align='center'>
                                            {searchedUserProfileData.username === userName ? (
                                                <form id='edit-profile' onSubmit={handleSubmit} >
                                                    <DialogRoot size='md' placement='center'>
                                                        <DialogTrigger asChild>
                                                            <Button size='sm' borderRadius='0.5rem' variant='subtle' color='black' bgColor='gray.200' >
                                                                <MdEdit />
                                                                Edit Profile
                                                            </Button>
                                                        </DialogTrigger>
                                                    <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle align='center'>
                                                            Edit profile
                                                        </DialogTitle>
                                                        <Separator mt='1rem' />
                                                        <Flex gap='4' justify='space-between' align='center' mt='1rem'>
                                                            <DialogTitle>
                                                                Profile Picture
                                                            </DialogTitle>
                                                            <FileUploadRootProvider value={fileUpload} w='1rem' mr='3rem'>
                                                                <FileUploadHiddenInput />
                                                                <FileUploadTrigger asChild>
                                                                    <Button variant='ghost'>
                                                                        Edit
                                                                    </Button>
                                                                </FileUploadTrigger>
                                                            </FileUploadRootProvider>
                                                        </Flex>
                                                        <Flex flexDirection='row' justify='center' align='center' mt='1rem'>
                                                            <Image src={ previewUrl || 'https://bit.ly/sage-adebayo' } borderRadius='full' boxSize='10rem' />
                                                        </Flex>
                                                        <Flex gap='4' justify='space-between' align='center' mt='1rem'>
                                                            <DialogTitle>
                                                                Name
                                                            </DialogTitle>
                                                            <Button variant='ghost' onClick={() => setIsEditNameClick(!isEditNameClick)}>
                                                                Edit
                                                            </Button>
                                                        </Flex>
                                                        <Flex flexDirection='row' justify='center' align='center' mt='1rem'>
                                                            {isEditNameClick && (
                                                                <Flex flexDirection='row' justify='center' align='center'>
                                                                    <Editable.Root defaultValue='Gago' value={newName} onValueChange={(e: any) => setNewName(e.value)} >
                                                                        <Editable.Preview alignItems='center' minH='2rem' w='full' />
                                                                        <Editable.Input h='2rem' borderStyle='none'  />
                                                                        <Editable.CancelTrigger asChild ml='1rem'>
                                                                        <IconButton variant='subtle' size='md' rounded='full'>
                                                                            <LuX />
                                                                        </IconButton>
                                                                        </Editable.CancelTrigger>
                                                                    </Editable.Root>
                                                                </Flex>
                                                            )}
                                                        </Flex>
                                                        <Flex gap='4' justify='space-between' align='center' mt='1rem'>
                                                            <DialogTitle>
                                                                Intro
                                                            </DialogTitle>
                                                            <Button variant='ghost' onClick={() => setIsEditBioClick(!isEditBioClick)}>
                                                                Edit
                                                            </Button>
                                                        </Flex>
                                                        <Flex flexDirection='row' justify='center' align='center' mt='1rem'>
                                                            {isEditBioClick && (
                                                                <Flex flexDirection='row' justify='center' align='center'>
                                                                    <Editable.Root defaultValue='Gago' value={newBio}  onValueChange={(e: any) => setNewBio(e.value)}>
                                                                        <Editable.Preview alignItems='center' h='2rem' w='full' />
                                                                        <Editable.Textarea borderStyle='none' h='5rem' />
                                                                        <Editable.CancelTrigger asChild ml='1rem'>
                                                                        <IconButton variant='subtle' size='md' rounded='full'>
                                                                            <LuX />
                                                                        </IconButton>
                                                                        </Editable.CancelTrigger>
                                                                    </Editable.Root>
                                                                </Flex>
                                                            )}
                                                        </Flex>
                                                        </DialogHeader>
                                                        <Button form='edit-profile' m='1rem' type='submit' onSubmit={handleSubmit}>
                                                            Save
                                                        </Button>
                                                        <DialogCloseTrigger />
                                                        </DialogContent>
                                                        </DialogRoot>
                                                </form>
                                                    ) : searchedUserProfileData.isFriend.status === 'pending' ? (
                                                        searchedUserProfileData.isFriend.receiver === userId ? (
                                                            <>
                                                            <Button size='sm' variant='subtle' color='black' bgColor='gray.200' borderRadius='0.5rem' onClick={handleAcceptFriend} >
                                                                <FaUserCheck />
                                                                Accept request
                                                            </Button>
                                                            <Button size='sm' variant='subtle' borderRadius='0.5rem' bgColor='blue.400' color='white' onClick={handleMessageUser} >
                                                                Message
                                                            </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                            <Button size='sm' variant='subtle' color='white' bgColor='blue.400' borderRadius='0.5rem' onClick={handleCancelRequest} >
                                                                <FaUserCheck />
                                                                Pending request
                                                            </Button>
                                                            <Button size='sm' variant='subtle' borderRadius='0.5rem' bgColor='gray.200' color='black' onClick={handleMessageUser} >
                                                                Message
                                                            </Button>
                                                        </> 
                                                        )
                                                    ) : searchedUserProfileData.isFriend.status === 'accepted' ? (
                                                        <>
                                                            <Button size='sm' variant='subtle' color='black' bgColor='gray.200' borderRadius='0.5rem' >
                                                                <AiOutlineUserAdd color='black' />
                                                                Friends
                                                            </Button>
                                                            <Button size='sm' variant='subtle' borderRadius='0.5rem' bgColor='blue.500' color='white' onClick={handleMessageUser} >
                                                                <LuMessageCircleMore />
                                                                Message
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button size='sm' variant='subtle' color='white' bgColor='blue.500' borderRadius='0.5rem' onClick={handleAddFriend} >
                                                                <AiOutlineUserAdd color='white' />
                                                                Add Friend
                                                            </Button>
                                                            <Button size='sm' variant='subtle' borderRadius='0.5rem' bgColor='gray.200' color='black' onClick={handleMessageUser} >
                                                                <LuMessageCircleMore />
                                                                Message
                                                            </Button>
                                                        </>
                                                    )}
                                        </Stack>
                                    </Stack>
                                </Stack> 
                            </Stack>
                            
                        </Card.Body>
                    </Card.Root>
                </GridItem>
                <GridItem colSpan={!isMobile ? 5 : 12} >
                    <Card.Root borderRadius='0.8rem' boxShadow='md'>
                        <Card.Body>
                           <Card.Title fontSize='1.3rem' fontWeight='bold'>Intro</Card.Title>
                            <Flex flexDirection='column' gap='2rem' justify='center' mt='1rem'>
                                <Card.Description fontSize='1rem' wordBreak='break-word' textAlign='center' >
                                    { !searchedUserProfileData.bio ? '' : searchedUserProfileData.bio }
                                </Card.Description>
                                <Stack direction='row' align='center' fontSize='1.3rem'>
                                    <Icon color='gray.400'>
                                        <FaClock />
                                    </Icon>
                                    <Card.Description fontSize='1rem'>Joined November 2012</Card.Description>
                                </Stack>
                            </Flex>
                        </Card.Body>
                    </Card.Root>
                </GridItem>
                <GridItem colSpan={!isMobile ? 7 : 12} >
                    {(searchedUserProfileData.isFriend.status === 'accepted' || searchedUserProfileData.isFriend.status === true) && (
                        <>
                            {searchedUserProfileData.username === userName ? (
                                <CreatePost createPostButtonSize={postButtonSize} />
                            ) : null}
                            <PostsList mt={searchedUserProfileData.username === userName ? '1.5rem' : '0'} />
                        </>
                    )}
                </GridItem>
           </Grid>
           <Toaster />
        </>
    )
}

export default ProfilePage
