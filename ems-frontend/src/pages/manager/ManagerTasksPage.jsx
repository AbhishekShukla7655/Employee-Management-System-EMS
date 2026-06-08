import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import {
  taskService,
  employeeService,
  managerService,
} from "../../services/api";
import {
  formatDate,
  getStatusColor,
  getPriorityColor,
} from "../../utils/helpers";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import {
  useSearch,
  usePagination,
  useModal,
  useConfirm,
} from "../../hooks/useCommon";

export default function ManagerTasksPage() {
  const queryClient = useQueryClient();
  const { value: search, debouncedValue: dSearch, onChange } = useSearch();
  const { page, size, nextPage, prevPage, goToPage } = usePagination();
  const formModal = useModal();
  const confirmDel = useConfirm();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["team-tasks", dSearch, page],
    queryFn: () =>
      taskService
        .getTeamTasks({ search: dSearch, page, size })
        .then((r) => r.data),
    retry: 1,
  });

  const { data: employees } = useQuery({
    queryKey: ["team-members-list"],
    queryFn: () => managerService.getTeam().then((r) => r.data || []),
    retry: 1,
  });

  const saveMutation = useMutation({
    mutationFn: (d) =>
      formModal.data?.id
        ? taskService.update(formModal.data.id, d)
        : taskService.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries(["team-tasks"]);
      formModal.close();
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => queryClient.invalidateQueries(["team-tasks"]),
  });

  const openEdit = (t) => {
    Object.entries(t).forEach(([k, v]) => setValue(k, v));
    formModal.open(t);
  };
  const empOptions = (employees || []).map((e) => ({
    value: e.id,
    label: `${e.firstName} ${e.lastName}`,
  }));
  const tasks = data?.content || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
          />
          <input
            value={search}
            onChange={onChange}
            placeholder="Search team tasks..."
            className="input pl-9"
          />
        </div>
        <Button
          leftIcon={Plus}
          onClick={() => {
            reset();
            formModal.open(null);
          }}
        >
          Assign Task
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                <th className="table-header text-left">Task</th>
                <th className="table-header text-left">Assigned To</th>
                <th className="table-header text-left">Priority</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left">Due Date</th>
                <th className="table-header text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6}>
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState title="No tasks found" />
                  </td>
                </tr>
              ) : (
                tasks.map((t) => (
                  <tr key={t.id} className="table-row">
                    <td className="table-cell">
                      <p className="font-medium text-[var(--text-primary)] text-sm">
                        {t.title}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] truncate max-w-xs">
                        {t.description}
                      </p>
                    </td>
                    <td className="table-cell text-sm">
                      {t.assignedToName || "—"}
                    </td>
                    <td className="table-cell">
                      <Badge className={getPriorityColor(t.priority)}>
                        {t.priority}
                      </Badge>
                    </td>
                    <td className="table-cell">
                      <Badge className={getStatusColor(t.status)}>
                        {t.status?.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="table-cell text-[var(--text-secondary)] text-sm">
                      {formatDate(t.dueDate)}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(t)}
                          className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-primary-600 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() =>
                            confirmDel.confirm(
                              `Delete task "${t.title}"?`,
                              () => deleteMutation.mutate(t.id),
                            )
                          }
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[var(--text-secondary)] hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-secondary)]">
              Page {page + 1} of {totalPages}
            </p>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={prevPage}
              onNext={nextPage}
              onGoTo={goToPage}
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title={formModal.data?.id ? "Edit Task" : "Assign Task to Employee"}
        size="md"
      >
        <form
          onSubmit={handleSubmit((d) => saveMutation.mutate(d))}
          className="space-y-4"
        >
          <Input
            label="Title"
            error={errors.title?.message}
            {...register("title", { required: "Required" })}
          />
          <div>
            <label className="label">Description</label>
            <textarea
              className="input h-20 resize-none"
              {...register("description")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Priority"
              options={["LOW", "MEDIUM", "HIGH"].map((v) => ({
                value: v,
                label: v,
              }))}
              {...register("priority", { required: "Required" })}
            />
            <Select
              label="Status"
              options={["PENDING", "IN_PROGRESS", "COMPLETED"].map((v) => ({
                value: v,
                label: v.replace("_", " "),
              }))}
              {...register("status")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Due Date" type="date" {...register("dueDate")} />
            <Select
              label="Assign To (Employee)"
              options={empOptions}
              placeholder="Select employee..."
              {...register("assignedToId")}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={formModal.close}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              loading={saveMutation.isPending}
            >
              {formModal.data?.id ? "Update" : "Assign"} Task
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        {...confirmDel}
        onConfirm={confirmDel.handleConfirm}
        onCancel={confirmDel.handleCancel}
      />
    </div>
  );
}
