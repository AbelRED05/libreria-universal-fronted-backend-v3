<?php

namespace App\Exceptions;

use Exception;

class LoanAlreadyReturnedException extends Exception
{
    public function __construct(string $message = 'El préstamo ya ha sido devuelto previamente.')
    {
        parent::__construct($message, 409);
    }
}
