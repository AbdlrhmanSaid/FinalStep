"use client";

import CheckUserRole from "../../../../../lib/actions/checkUserRole";
import { useState } from "react";
import { Input } from "../../../../../@/components/ui/input";
import { Label } from "../../../../../@/components/ui/label";
import { Button } from "../../../../../components/ui/button";
import { Textarea } from "../../../../../@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { useAppContext } from "../../../../../contexts/AppContext";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { useAddTask } from "../../../../../hooks/tasks/useAddTask";
import { useGetProject } from "../../../../../hooks/projects/useGetProjects";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../../@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../../../../lib/utils";

export default function TaskForm({ content, isRTL }) {
  const { userId } = useAppContext();
  const router = useRouter();
  const { id: projectId } = useParams();
  const { data: projectData, isLoading: projectLoading } =
    useGetProject(projectId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [open, setOpen] = useState(false);
  const { mutate: addTask, isPending } = useAddTask();

  const members = projectData?.members || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      projectId,
      assignedTo,
      status: "pending",
      createdBy: userId,
    };

    toast
      .promise(
        new Promise((resolve, reject) => {
          addTask(formData, {
            onSuccess: () => {
              setTitle("");
              setDescription("");
              setAssignedTo([]);
              resolve();
            },
            onError: () => reject(),
          });
        }),
        {
          loading: "Creating task...",
          success: "Task created successfully!",
          error: "Failed to create task.",
        }
      )
      .then(() => {
        router.push(`/dashboard/project/${projectId}`);
      });
  };

  const addMember = (memberId) => {
    if (!assignedTo.includes(memberId)) {
      setAssignedTo([...assignedTo, memberId]);
    }
    setOpen(false);
  };

  const removeMember = (memberId) => {
    setAssignedTo(assignedTo.filter((id) => id !== memberId));
  };

  return (
    <CheckUserRole>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-xl mx-auto dark:text-white h-screen"
      >
        {/* Title */}
        <div>
          <Label htmlFor="title" className="mb-3">
            {content.titleInput || "Task Title"}
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="mb-3">
            {content.describe || "Description"}
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Assigned Members */}
        <div>
          <Label className="mb-3">{content.assignTo || "Assign To"}</Label>
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search members..."
              onFocus={() => setOpen(true)}
              className="h-10"
            />
            {open && (
              <CommandList>
                <CommandEmpty>No members found.</CommandEmpty>
                <CommandGroup>
                  {members.map((member) => (
                    <CommandItem
                      key={member._id}
                      value={member._id}
                      onSelect={() => addMember(member._id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          assignedTo.includes(member._id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {member.name || member.email}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
          <div className="mt-2">
            {assignedTo.map((memberId, index) => {
              const member = members.find((m) => m._id === memberId);
              return (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <div className="flex-1">
                    <Input
                      value={member?.name || member?.email || ""}
                      disabled
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => removeMember(memberId)}
                    aria-label="Remove member"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || projectLoading}
        >
          {isPending
            ? content.pendingTask || "Creating..."
            : content.createTask || "Create Task"}
        </Button>
      </form>
    </CheckUserRole>
  );
}
