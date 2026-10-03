<?php

namespace App\Exceptions;

use Exception;

class BookNotAvailableException extends Exception
{
    public function __construct(string $message = 'No hay ejemplares disponibles para este libro en este momento.')
    {
        parent::__construct($message, 409);
    }
}
