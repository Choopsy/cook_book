'use client'

import { useTransition } from 'react'
import { Check, X, UserMinus, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
  removeFriend,
} from '@/actions/friendships'

type Props =
  | { type: 'add';      targetId: string }
  | { type: 'incoming'; friendshipId: string }
  | { type: 'outgoing'; friendshipId: string }
  | { type: 'friend';   friendshipId: string }

export function FriendActions(props: Props) {
  const [isPending, startTransition] = useTransition()

  if (props.type === 'add') {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled={isPending}
        onClick={() => startTransition(async () => { await sendFriendRequest(props.targetId) })}
      >
        <UserPlus className="h-3.5 w-3.5 mr-1.5" />
        Ajouter
      </Button>
    )
  }

  if (props.type === 'incoming') {
    return (
      <div className="flex gap-1.5">
        <Button
          size="icon"
          className="h-8 w-8"
          disabled={isPending}
          onClick={() => startTransition(async () => { await acceptFriendRequest(props.friendshipId) })}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={isPending}
          onClick={() => startTransition(async () => { await declineFriendRequest(props.friendshipId) })}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  if (props.type === 'outgoing') {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="text-muted-foreground"
        disabled={isPending}
        onClick={() => startTransition(async () => { await cancelFriendRequest(props.friendshipId) })}
      >
        Annuler
      </Button>
    )
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
      disabled={isPending}
      onClick={() => {
        if (!confirm('Supprimer cet ami ?')) return
        startTransition(async () => { await removeFriend(props.friendshipId) })
      }}
    >
      <UserMinus className="h-4 w-4" />
    </Button>
  )
}
