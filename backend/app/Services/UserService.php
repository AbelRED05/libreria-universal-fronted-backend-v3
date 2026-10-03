<?php

namespace App\Services;

use App\DTOs\UserDTO;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class UserService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    public function getPaginatedUsers(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->userRepository->getAllPaginated($filters, $perPage);
    }

    public function getUserById(int $id): User
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            $e = new ModelNotFoundException();
            $e->setModel(User::class, [$id]);
            throw $e;
        }

        return $user;
    }

    public function createUser(UserDTO $dto): User
    {
        $data = $dto->toArray();
        if (!empty($dto->password)) {
            $data['password'] = Hash::make($dto->password);
        }

        return $this->userRepository->create($data);
    }

    public function updateUser(int $id, UserDTO $dto): User
    {
        $user = $this->getUserById($id);
        $data = $dto->toArray();

        if (!empty($dto->password)) {
            $data['password'] = Hash::make($dto->password);
        } else {
            unset($data['password']);
        }

        return $this->userRepository->update($user, $data);
    }

    public function deleteUser(int $id): bool
    {
        $user = $this->getUserById($id);

        if ($user->activeLoans()->exists()) {
            throw new ConflictHttpException('No se puede eliminar el usuario porque tiene préstamos de libros pendientes de devolución.');
        }

        // Prevent deleting the sole admin
        if ($user->isAdmin() && User::where('role', User::ROLE_ADMIN)->count() <= 1) {
            throw new ConflictHttpException('No se puede eliminar el único administrador del sistema.');
        }

        return $this->userRepository->delete($user);
    }
}
