<?php

namespace App\Exceptions;

use Exception;

class UnauthorizedRoleException extends Exception
{
    public function __construct(string $message = 'No tienes los permisos requeridos para ejecutar esta acción.')
    {
        parent::__construct($message, 403);
    }
}
