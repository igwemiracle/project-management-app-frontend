import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { socketService } from '../services/socket';
import {
  setConnected,
  userOnline,
  userOffline,
  updateOnlineUsers,
} from '../store/slices/realtimeSlice';
import {
  workspaceUpdatedRealtime,
  workspaceDeletedRealtime,
} from '../store/slices/workspaceSlice';
import {
  boardCreatedRealtime,
  boardUpdatedRealtime,
  boardDeletedRealtime,
  listCreatedRealtime,
  listUpdatedRealtime,
  listDeletedRealtime,
  cardCreatedRealtime,
  cardUpdatedRealtime,
  cardDeletedRealtime,
} from '../store/slices/boardSlice';

export const useSocket = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    const socket = socketService.connect(user._id, user.username);

    socket.on('connect', () => {
      dispatch(setConnected(true));
    });

    socket.on('disconnect', () => {
      dispatch(setConnected(false));
    });

    socket.on('userOnline', (data) => {
      dispatch(userOnline(data));
    });

    socket.on('userOffline', (userId) => {
      dispatch(userOffline(userId));
    });

    socket.on('onlineUsers', (users) => {
      dispatch(updateOnlineUsers(users));
    });

    socket.on('workspaceUpdated', (workspace) => {
      dispatch(workspaceUpdatedRealtime(workspace));
    });

    socket.on('workspaceDeleted', (workspaceId) => {
      dispatch(workspaceDeletedRealtime(workspaceId));
    });

    socket.on('boardCreated', (board) => {
      dispatch(boardCreatedRealtime(board));
    });

    socket.on('boardUpdated', (board) => {
      dispatch(boardUpdatedRealtime(board));
    });

    socket.on('boardDeleted', (boardId) => {
      dispatch(boardDeletedRealtime(boardId));
    });

    socket.on('listCreated', (list) => {
      dispatch(listCreatedRealtime(list));
    });

    socket.on('listUpdated', (list) => {
      dispatch(listUpdatedRealtime(list));
    });

    socket.on('listDeleted', (listId) => {
      dispatch(listDeletedRealtime(listId));
    });

    socket.on('cardCreated', (card) => {
      dispatch(cardCreatedRealtime(card));
    });

    socket.on('cardUpdated', (card) => {
      dispatch(cardUpdatedRealtime(card));
    });

    socket.on('cardDeleted', (cardId) => {
      dispatch(cardDeletedRealtime(cardId));
    });

    return () => {
      socketService.disconnect();
    };
  }, [user, dispatch]);

  return socketService;
};
