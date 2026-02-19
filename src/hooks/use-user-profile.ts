"use client";

import { useDoc, useFirebase, useMemoFirebase, useUser } from "@/firebase";
import { doc, serverTimestamp } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import type { UserProfile } from "@/lib/types";

export function useUserProfile() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const profileDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [firestore, user]);

  const { data: profile, isLoading, error } = useDoc<UserProfile>(profileDocRef);

  const updateUserProfile = (updatedData: Partial<Omit<UserProfile, "id">>) => {
    if(!profileDocRef || !user) return;

    const dataToSet: Partial<UserProfile> & { updatedAt: any; createdAt?: any } = {
        ...updatedData,
        updatedAt: serverTimestamp()
    };

    if (!profile) {
        dataToSet.email = user.email!;
        dataToSet.id = user.uid;
        dataToSet.displayName = user.displayName || user.email;
        dataToSet.createdAt = serverTimestamp();
    }

    setDocumentNonBlocking(profileDocRef, dataToSet, { merge: true });
  };

  return { profile, updateUserProfile, isLoading, error };
}

    