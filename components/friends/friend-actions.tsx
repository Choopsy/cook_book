'use client'

import { useTransition } from 'react'
import { Check, X, UserMinus, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              disabled={isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Refuser cette demande d&apos;ami ?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => startTransition(async () => { await declineFriendRequest(props.friendshipId) })}
              >
                Refuser
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  if (props.type === 'outgoing') {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="ghost" className="text-muted-foreground" disabled={isPending}>
            Annuler
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la demande d&apos;ami ?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Non</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => startTransition(async () => { await cancelFriendRequest(props.friendshipId) })}
            >
              Annuler la demande
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={isPending}
        >
          <UserMinus className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer cet ami ?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => startTransition(async () => { await removeFriend(props.friendshipId) })}
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
