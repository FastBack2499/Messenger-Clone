'use client'

import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Conversation, Message, User } from "@prisma/client"
import { format } from 'date-fns'
import { useSession } from "next-auth/react"
import clsx from "clsx"
import { FullConversationType } from "@/app/types"
import useOtherUser from "@/app/hooks/useOtherUser"
import Avatar from "@/app/components/Avatar"
import AvatarGroup from "@/app/components/AvatarGroup"

interface ConversationBoxProps {
    data: FullConversationType,
    selected?: boolean,
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
    data,
    selected
}) => {

    const otherUser = useOtherUser(data)
    const session = useSession()
    const router = useRouter()

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
    }, [data.id, router])

    const lastMassage = useMemo(() => {
        const messages = data.messages || []

        return messages[messages.length - 1]
    }, [data.messages])

    const userEmail = useMemo(() => {
        return session.data?.user?.email
    }, [session.data?.user?.email])

    const hasSeen = useMemo(() => {
        if(!lastMassage) {
            return false
        }

        const seenArray = lastMassage.seen || []

        if(!userEmail) {
            return false
        }

        return seenArray
        .filter((user) => user.email === userEmail).length != 0

    }, [userEmail, lastMassage])

    const lastMassageText = useMemo(() => {
        if(lastMassage?.image) {
            return 'Sent an Image'
        }

        if(lastMassage?.body) {
            return lastMassage.body
        }

        return 'Started a Conversation!'
        
    }, [lastMassage])

    return (
        <div onClick={handleClick} className={clsx(`
            w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-3
        `, selected ? 'bg-neutral-100' : 'bg-white')}>
            {data.isGroup ? (
                <AvatarGroup users={data.users}/>
            ) : (
                <Avatar user={otherUser}/>
            )}
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-md text-gray-900 font-semibold">
                            {data.name || otherUser.name}
                        </p>
                        {lastMassage?.createdAt && (
                            <p className="text-xs text-gray-400 font-light">
                                {format(new Date(lastMassage.createdAt), 'p')}
                            </p>
                        )}
                    </div>
                    <p className={clsx(`truncate text-sm`, hasSeen ? 'text-gray-500' : 'text-black font-medium')}>
                        {lastMassageText}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ConversationBox