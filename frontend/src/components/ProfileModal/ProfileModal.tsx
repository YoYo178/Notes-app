import { FC, ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { createPortal } from 'react-dom';

import { IoMdClose } from 'react-icons/io';
import { FaCheck, FaTrashAlt } from 'react-icons/fa';

import { useAuthContext } from '../../contexts/AuthContext';

import { useUpdateUserMutation } from '../../hooks/network/user/useUpdateUserMutation';
import { useDeleteUserMutation } from '../../hooks/network/user/useDeleteUserMutation';

import { clearCachedData } from '../../util/cache.utils';

import { ButtonHandler } from './ProfileModal';

import "./ProfileModal.css"

interface CreateNoteModelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileModal: FC<CreateNoteModelProps> = ({ isOpen, onClose }) => {
    const updateUserMutation = useUpdateUserMutation({ queryKey: ['auth'] });
    const deleteUserMutation = useDeleteUserMutation({ queryKey: ['auth'] });

    const { auth, setAuth } = useAuthContext();

    const [displayName, setDisplayName] = useState(auth?.displayName);
    const [email, setEmail] = useState(auth?.email);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [redirect, setRedirect] = useState<ReactNode>(null);
    const location = useLocation();

    const queryClient = useQueryClient();

    useEffect(() => {
        if (updateUserMutation.isSuccess) {
            setAuth({ ...auth, displayName, email });
            onClose();

            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        }
    }, [updateUserMutation.isSuccess])

    useEffect(() => {
        if (deleteUserMutation.isSuccess) {
            setAuth(null);
            setRedirect(<Navigate to='/' state={{ from: location }} replace />);

            // Clear cached data
            clearCachedData(queryClient)
        }
    }, [deleteUserMutation.isSuccess])

    if (!isOpen) return null;

    if (redirect)
        return redirect;

    return createPortal(
        <div className='pm-backdrop' onMouseDown={onClose}>
            <div className='pm' onMouseDown={(e) => e.stopPropagation()}>
                <div className="pm-header">
                    <h2 className='pm-title'>Profile details</h2>
                    <button className='pm-close-button' onClick={onClose}>
                        <IoMdClose className='pm-close-button-icon' />
                    </button>
                </div>
                <div className="pm-fields">

                    <div className="pm-field-username-container">
                        <label htmlFor="pm-username-field" className="pm-field-username-label">Username</label>
                        <input
                            type="text"
                            name="Username"
                            id="pm-username-field"
                            className="pm-field-username"
                            value={auth?.username}
                            disabled
                        />
                    </div>

                    <div className="pm-field-display-name-container">
                        <label htmlFor="pm-display-name-field" className="pm-field-display-name-label">Display name</label>
                        <input
                            type="text"
                            name="Display Name"
                            id="pm-display-name-field"
                            className="pm-field-display-name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            autoComplete='off'
                        />
                    </div>

                    <div className="pm-field-email-container">
                        <label htmlFor="pm-email-field" className="pm-field-email-label">Email</label>
                        <input
                            type="email"
                            name="Email"
                            id="pm-email-field"
                            className="pm-field-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete='off'
                        />
                    </div>

                    <div className="pm-field-password-container">
                        <div className="pm-field-current-password-container">
                            <label htmlFor="pm-current-password-field" className="pm-field-current-password-label">Current password</label>
                            <input
                                type="password"
                                name="Current Password"
                                id="pm-current-password-field"
                                className="pm-field-current-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                autoComplete='off'
                            />
                        </div>

                        <div className="pm-field-new-password-container">
                            <label htmlFor="pm-new-password-field" className="pm-field-username-label">New password</label>
                            <input
                                type="password"
                                name="New Password"
                                id="pm-new-password-field"
                                className="pm-field-new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete='off'
                            />
                        </div>

                        <div className="pm-field-confirm-new-password-container">
                            <label htmlFor="pm-confirm-new-password-field" className="pm-field-username-label">Confirm new password</label>
                            <input
                                type="password"
                                name="Confirm new password"
                                id="pm-confirm-new-password-field"
                                className="pm-field-confirm-new-password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                autoComplete='off'
                            />
                        </div>
                    </div>
                </div>
                <div className="pm-footer">
                    <div className="pm-field-id-container">
                        <label htmlFor="pm-id-field" className="pm-field-id-label">ID:</label>
                        <p id="pm-id-field" className="pm-field-id">{auth?.id}</p>
                    </div>
                    <button className="pm-delete-acc-button" onClick={() => { ButtonHandler.deleteAccButtonOnClick(deleteUserMutation) }}>
                        <FaTrashAlt />
                        <span>Delete account</span>
                    </button>
                    <button className="pm-check-button" onClick={() => {
                        const res = ButtonHandler.profileModalOnSubmit(updateUserMutation, auth, { displayName, email, currentPassword, newPassword, confirmNewPassword });
                        if (res === true) {
                            onClose();

                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmNewPassword('');
                        }
                    }}>
                        <FaCheck />
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")!
    )
}