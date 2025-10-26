import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface JoinRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomJoined: (room: any) => void;
}

export function JoinRoomDialog({ open, onOpenChange, onRoomJoined }: JoinRoomDialogProps) {
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomCode.trim()) {
      toast({
        title: 'Error',
        description: 'Room code is required',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.joinChatRoom(roomCode.trim().toUpperCase());
      onRoomJoined(response.room);
      onOpenChange(false);
      setRoomCode('');
      
      toast({
        title: 'Success',
        description: `Joined room "${response.room.name}" successfully!`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to join room',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setRoomCode('');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Private Chat Room</DialogTitle>
          <DialogDescription>
            Enter the room code to join a private chat room. Ask the room creator for the code.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-code">Room Code *</Label>
            <Input
              id="room-code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character room code"
              maxLength={6}
              className="uppercase text-center text-lg tracking-widest"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !roomCode.trim()}>
              {isLoading ? 'Joining...' : 'Join Room'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
