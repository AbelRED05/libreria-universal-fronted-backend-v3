<?php

namespace Tests\Feature;

use Tests\TestCase;

class LoanRoutesRemovedTest extends TestCase
{
    public function test_loan_api_routes_are_not_available(): void
    {
        $this->getJson('/api/v1/loans')->assertNotFound();
        $this->getJson('/api/v1/loans/1')->assertNotFound();
        $this->getJson('/api/v1/me/loans')->assertNotFound();
        $this->postJson('/api/v1/loans')->assertNotFound();
        $this->patchJson('/api/v1/loans/1/return')->assertNotFound();
    }
}
