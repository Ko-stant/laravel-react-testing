<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->query('per_page', 15), 50);
        $contacts = Contact::query()
            ->orderBy('id', 'desc')
            ->paginate($perPage);

        return response()->json($contacts);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'=> 'required|email|unique:contacts,email',
            'company'    => 'required|string|max:255',
        ]);

        $contact = Contact::create($data);
        return response()->json($contact, 201);
    }

    public function show(Contact $contact): JsonResponse
    {
        return response()->json($contact);
    }

    public function update(Request $request, Contact $contact): JsonResponse
    {
        $data = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name'  => 'sometimes|required|string|max:255',
            'email' => "sometimes|required|email|unique:contacts,email,{$contact->id}",
            'company'    => 'nullable|required|string|max:255',
        ]);

        $contact->update($data);
        return response()->json($contact);
    }

    public function destroy(Contact $contact): JsonResponse
    {
        $contact->delete();
        return response()->json(['ok' => true]);
    }
}
