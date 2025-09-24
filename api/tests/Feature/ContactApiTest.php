<?php

namespace Tests\Feature;

use App\Models\Contact;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_contacts(): void
    {
        Contact::factory()->count(3)->create();

        $response = $this->getJson('/api/contacts');
        $response->assertOk()->assertJsonStructure(['data', 'links', 'path', 'total']);
    }

    public function test_store_creates_contact(): void
    {
        $payload = [
            'first_name' => 'Bob',
            'last_name'  => 'Loblaw',
            'email'      => 'bob@example.com',
            'company'    => 'Super Company',
        ];

        $response = $this->postJson('/api/contacts', $payload);
        $response->assertCreated()->assertJsonFragment(['email' => 'bob@example.com']);
    }

    public function test_update_edits_contact(): void
    {
        $contact = Contact::factory()->create();
        $response = $this->putJson("/api/contacts/{$contact->id}", ['company' => 'A Brand new Job! Co.']);
        $response->assertOk()->assertJsonFragment(['company' => 'A Brand new Job! Co.']);
    }

    public function test_destroy_deletes_contact(): void
    {
        $contact = Contact::factory()->create();
        $response = $this->deleteJson("/api/contacts/{$contact->id}");
        $response->assertOk();
        $this->assertDatabaseMissing('contacts', ['id' => $contact->id]);
    }
}
