"use client";

import { useState } from "react";
import { FormField, Input, OperationButton } from "@/components/form";
import { Modal } from "@/components/modal";
import type { AccountItem } from "@/modules/account/pages/components/types";

export function AccountModal(props: { open: boolean; item: AccountItem | null; onClose: () => void; onSubmit: (payload: any) => Promise<void> }) {
  const [title, setTitle] = useState(props.item?.title ?? "");
  const [url, setUrl] = useState(props.item?.url ?? "");
  const [tags, setTags] = useState((props.item?.tagsJson ?? []).join(","));

  if (!props.open) return null;

  return (
    <Modal open={props.open} title={props.item ? "계정 수정" : "계정 신규"} onClose={props.onClose} size="medium" footer={<div className="flex justify-end gap-2"><OperationButton label="취소" onClick={props.onClose} /><OperationButton label="저장" variant="primary" onClick={() => void props.onSubmit({ title, url, tagsJson: tags.split(",").map((v) => v.trim()).filter(Boolean) })} /></div>}>
      <div className="space-y-2">
        <FormField label="제목" htmlFor="a-title"><Input id="a-title" value={title} onChange={(e) => setTitle(e.target.value)} /></FormField>
        <FormField label="URL" htmlFor="a-url"><Input id="a-url" value={url} onChange={(e) => setUrl(e.target.value)} /></FormField>
        <FormField label="태그" htmlFor="a-tags"><Input id="a-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="콤마로 구분" /></FormField>
      </div>
    </Modal>
  );
}
