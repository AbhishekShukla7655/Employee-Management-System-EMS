import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Search, Edit2, Trash2 } from "lucide-react";
import { userService, employeeService } from "../../services/api";
import { formatDate, getRoleColor } from "../../utils/helpers";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";
import Avatar from "../../components/common/Avatar";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import {
  useSearch,
  usePagination,
  useModal,
  useConfirm,
} from "../../hooks/useCommon";

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
];
const DESIGNATIONS = [
  "CEO",
  "CTO",
  "COO",
  "VP Engineering",
  "VP Sales",
  "MIS Executive",
  "Project Manager",
  "Product Manager",
  "Sr. Software Engineer",
  "Software Engineer",
  "Jr. Software Engineer",
  "Team Lead",
  "Tech Lead",
  "Solution Architect",
  "UI/UX Designer",
  "Graphic Designer",
  "HR Executive",
  "HR Manager",
  "Sales Executive",
  "Business Analyst",
  "Data Analyst",
  "Finance Executive",
  "Accountant",
  "Operations Executive",
  "System Administrator",
];

export default function ManageUsersPage() {
  const queryClient = useQueryClient();
  const {
    value: search,
    debouncedValue: dSearch,
    onChange: onSearchChange,
  } = useSearch();
  const { page, size, nextPage, prevPage, goToPage } = usePagination();
  const [roleFilter, setRoleFilter] = useState("");
  const formModal = useModal();
  const confirmDel = useConfirm();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["all-users", dSearch, page, roleFilter],
    queryFn: () =>
      employeeService
        .getAll({ search: dSearch, page, size })
        .then((r) => r.data),
    retry: 1,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, empId, data }) =>
      Promise.all([
        userService.changeRole(id, data.role),
        employeeService.update(empId, data),
      ]),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
      formModal.close();
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (u) => userService.delete(u.userId),
    onSuccess: () => queryClient.invalidateQueries(["all-users"]),
  });

  const openEdit = (user) => {
    Object.entries(user).forEach(([k, v]) => setValue(k, v));
    setValue("role", user.role);
    formModal.open(user);
  };

  const users = (data?.content || []).filter((u) =>
    roleFilter ? u.role === roleFilter : true,
  );
  const totalPages = data?.totalPages || 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              value={search}
              onChange={onSearchChange}
              placeholder="Search users..."
              className="input pl-9"
            />
          </div>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: "ADMIN", label: "Admin" },
              { value: "MANAGER", label: "Manager" },
              { value: "EMPLOYEE", label: "Employee" },
            ]}
            placeholder="All Roles"
            className="w-40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                <th className="table-header text-left">User</th>
                <th className="table-header text-left">Role</th>
                <th className="table-header text-left">Department</th>
                <th className="table-header text-left">Designation</th>
                <th className="table-header text-left">Joined</th>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState title="No users found" />
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={`${u.firstName} ${u.lastName}`}
                          src={u.profileImageUrl}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-[var(--text-primary)] text-sm">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <Badge className={getRoleColor(u.role)}>{u.role}</Badge>
                    </td>
                    <td className="table-cell text-sm text-[var(--text-secondary)]">
                      {u.department || "—"}
                    </td>
                    <td className="table-cell text-sm text-[var(--text-secondary)]">
                      {u.designation || "—"}
                    </td>
                    <td className="table-cell text-sm text-[var(--text-secondary)]">
                      {formatDate(u.joiningDate)}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-primary-600 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() =>
                            confirmDel.confirm(
                              `Delete user "${u.firstName} ${u.lastName}"? This cannot be undone.`,
                              () => deleteMutation.mutate(u),
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

      {/* Edit Modal */}
      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title="Edit User"
        size="md"
      >
        <form
          onSubmit={handleSubmit((d) =>
            updateMutation.mutate({
              id: formModal.data?.userId,
              data: d,
            }),
          )}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              {...register("firstName", { required: "Required" })}
            />
            <Input
              label="Last Name"
              {...register("lastName", { required: "Required" })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Phone" {...register("phoneNumber")} />
            <Select
              label="Role"
              options={[
                { value: "ADMIN", label: "Admin" },
                { value: "MANAGER", label: "Manager" },
                { value: "EMPLOYEE", label: "Employee" },
              ]}
              {...register("role")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Department"
              options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
              {...register("department")}
            />
            <Select
              label="Designation"
              options={DESIGNATIONS.map((d) => ({ value: d, label: d }))}
              {...register("designation")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Joining Date"
              type="date"
              {...register("joiningDate")}
            />
            <Input label="Salary (₹)" type="number" {...register("salary")} />
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
              loading={updateMutation.isPending}
            >
              Save Changes
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
