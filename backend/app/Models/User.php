<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    public const ROLE_ADMIN = 'admin';
    public const ROLE_LIBRARIAN = 'librarian';
    public const ROLE_CLIENT = 'client';

    public const ROLES = [
        self::ROLE_ADMIN,
        self::ROLE_LIBRARIAN,
        self::ROLE_CLIENT,
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'favorite_genre',
        'loyalty_points',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'loyalty_points' => 'integer',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     */
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     */
    public function getJWTCustomClaims(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
        ];
    }

    /**
     * Loans relationship.
     */
    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }

    /**
     * Active loans relationship.
     */
    public function activeLoans(): HasMany
    {
        return $this->hasMany(Loan::class)->where('status', 'active');
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * Check if user is librarian.
     */
    public function isLibrarian(): bool
    {
        return $this->role === self::ROLE_LIBRARIAN;
    }

    /**
     * Check if user is client/reader.
     */
    public function isClient(): bool
    {
        return $this->role === self::ROLE_CLIENT;
    }

    /**
     * Check if user can manage books and loans (admin or librarian).
     */
    public function canManageLibrary(): bool
    {
        return in_array($this->role, [self::ROLE_ADMIN, self::ROLE_LIBRARIAN], true);
    }
}
