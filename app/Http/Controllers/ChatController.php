<?php

namespace App\Http\Controllers;

use App\Events\ChatSent;
use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        $chats = Chat::with('user')
            ->latest()
            ->get();

        return Inertia::render('Chats', [
            'messages' => $chats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:10000'],
        ]);

        $chat = Chat::create([
            'user_id' => Auth::id(),
            'content' => $validated['message'],
        ]);

        ChatSent::dispatch($chat);

        return redirect()->route('chats.index');
    }
}
