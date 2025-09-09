<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Reply;
use App\Models\QuestionRating;
use App\Models\User;

class AddSampleReplies extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'replies:add-sample';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add sample replies to existing questions and ratings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get the Fatooma store owner
        $fatoomaUser = User::where('email', 'fatooma@example.com')->first();
        if (!$fatoomaUser) {
            $this->error('Fatooma user not found');
            return 1;
        }

        // Get some existing questions/ratings
        $questionsRatings = QuestionRating::where('store_id', $fatoomaUser->store_id)->take(4)->get();

        if ($questionsRatings->count() === 0) {
            $this->error('No questions/ratings found');
            return 1;
        }

        // Create sample replies
        $sampleReplies = [
            'Thank you for your excellent review! We\'re thrilled that you love the product. We appreciate your feedback and look forward to serving you again.',
            'Great question! Yes, this product comes with a 2-year warranty. Please keep your receipt for warranty claims.',
            'We appreciate your feedback! We\'re constantly working to improve our products and services. Thank you for choosing Fatooma!',
            'Yes, we offer international shipping to most countries. Shipping costs and delivery times vary by location.'
        ];

        $created = 0;
        foreach ($questionsRatings as $index => $qr) {
            if (isset($sampleReplies[$index])) {
                Reply::create([
                    'content' => $sampleReplies[$index],
                    'question_rating_id' => $qr->id,
                    'user_id' => $fatoomaUser->id,
                    'status' => 'published',
                    'created_at' => now()->subHours($index + 1),
                ]);
                $this->info("Created reply for {$qr->type} ID: {$qr->id}");
                $created++;
            }
        }

        $this->info("Sample replies created successfully! Total: {$created}");
        return 0;
    }
}