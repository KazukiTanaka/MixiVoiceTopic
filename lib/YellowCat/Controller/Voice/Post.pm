package YellowCat::Controller::Voice::Post;
use Moose;
use namespace::autoclean;

use Data::Dumper;

BEGIN { extends 'Catalyst::Controller' }

__PACKAGE__->config(namespace => 'voice/post');

sub auto :Private {
    my ($self, $c) = @_;
    
    return 1;
}

sub statuses :Local {
    my ( $self, $c ) = @_;

    my $mixi = $c->forward('/mixi');
    my $voice;
    eval {
        $voice = $mixi->voice->statuses(
            status    => $c->req->param('status'),
        )->post->as_hashref;
    };
    $c->stash->{contents} = $voice;
    $c->cache->set(
        'VOICE:POST:STATUSES:'.$c->session->{id},
        $voice->{id},
        259200, #3days
    );
    return $voice;
}

sub favorites :Local { 
    my ( $self, $c ) = @_;

    my $mixi = $c->forward('/mixi');
    my $favorite_list_ref;
    eval {
        $favorite_list_ref = $mixi->voice->favorites(
            post_id => $c->req->param('post_id'),
        )->post->as_hashref;
    };
    $c->stash->{contents} = $favorite_list_ref;
    return $favorite_list_ref;
}

sub replies :Local {
    my ( $self, $c ) = @_;

    my $mixi = $c->forward('/mixi');
    my $replies_list_ref;
    eval {
        $replies_list_ref= $mixi->voice->replies(
            post_id => $c->req->param('post_id'),
            text    => $c->req->param('text'),
        )->post->as_hashref;
    };
    $c->stash->{contents} = $replies_list_ref;
    return $replies_list_ref;
}

sub end : Private {
    my ( $self, $c ) = @_;
    $c->forward('View::JSON');
}

__PACKAGE__->meta->make_immutable;

1;
