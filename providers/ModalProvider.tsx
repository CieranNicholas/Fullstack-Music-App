"use client";

import { useEffect, useState } from "react";

import Modal from "@/components/Modal";

const ModalProvider = () => {
  const [isMouned, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMouned) return null;

  return (
    <>
      <Modal
        isOpen
        onChange={() => {}}
        title='Test Modal'
        description='Test Description'
      >
        Test Children
      </Modal>
    </>
  );
};

export default ModalProvider;
