package YellowCat::Controller::Voice::Get;
use Moose;
use namespace::autoclean;

use Data::Dumper;

BEGIN { extends 'Catalyst::Controller' }

__PACKAGE__->config(namespace => 'voice/get');

sub auto :Private {
    my ($self, $c) = @_;
    
    # no cache
    return 1 if ($c->action->reverse eq 'voice/get/statuses');
    
    #if (my $result = $c->cache->get($c->action->reverse.$c->session->{friend_id}.$c->sessionid)) {
    #    $c->log->debug('from cache get '. $c->action->reverse);
    #    $c->stash->{contents} = $result || '';
    #    return 0;
    #}
    return 1;
}

sub timeline :Local {
    my ( $self, $c ) = @_;

    my $user_id     = $c->session->{friend_id} || '@me';
    my $mixi        = $c->forward('/mixi');
    my $timeline;
    eval {
        $timeline   = $mixi->voice(count => 200)->statuses(
            attach_photo    => 1,
        )->user_timeline(
            user_id         => $user_id,
        )->get->as_hashref;
    };
    if ( Exception::Class->caught('Mixi::Graph::Exception::RPC') ) {
        $c->forward('/logout');
        return 0;
    }
    
    unless ($timeline) {
        $c->stash->{contents} = [];
        return 1; 
    };
    my @statuses_point_list;
    for my $status (@$timeline) {
        my $favorite_count  = $status->{favorite_count}    || 0;
        my $reply_count     = $status->{reply_count}       || 0;
        push @statuses_point_list, {
            favorite_count  => $favorite_count,
            reply_count     => $reply_count,
            point           => $favorite_count + $reply_count * 3,
            data            => $status,
        };
    }
    my @sorted_point_list = sort {$b->{point} <=> $a->{point} } @statuses_point_list;
    my $max     = (scalar @sorted_point_list <= 10) ? scalar @sorted_point_list : 10;
    my @result  = map { $_->{data} } @sorted_point_list[0..$max-1];
    $c->stash->{contents} = \@result;
}

sub friends_timeline :Local {
    my ( $self, $c ) = @_;

    my $mixi        = $c->forward('/mixi');
    my $timeline;
    eval {
        $timeline   = $mixi->voice(count => 200)->statuses(
            attach_photo    => 1,
        )->friends_timeline->get->as_hashref;
    };
    if ( Exception::Class->caught('Mixi::Graph::Exception::RPC') ) {
        $c->forward('/logout');
        return 0;
    }
    
    unless ($timeline) {
        $c->stash->{contents} = [];
        return 1; 
    };
    my @statuses_point_list;
    for my $status (@$timeline) {
        my $favorite_count  = $status->{favorite_count}    || 0;
        my $reply_count     = $status->{reply_count}       || 0;
        push @statuses_point_list, {
            favorite_count  => $favorite_count,
            reply_count     => $reply_count,
            point           => $favorite_count + $reply_count * 3,
            data            => $status,
        };
    }
    my @sorted_point_list = sort {$b->{point} <=> $a->{point} } @statuses_point_list;
    my $max     = (scalar @sorted_point_list <= 20) ? scalar @sorted_point_list : 20;
    my @result = map { $_->{data} } @sorted_point_list[0..$max-1];
    $c->stash->{contents} = \@result;
}

sub statuses :Local {
    my ( $self, $c ) = @_;

    my $mixi = $c->forward('/mixi');
    my $voice;
    eval {
        $voice = $mixi->voice->statuses(
            post_id         => $c->req->param('post_id'),
            attach_photo    => 1,
        )->get->as_hashref;
    };
    if ( !$voice || Exception::Class->caught('Mixi::Graph::Exception::RPC') ) {
        $c->stash->{contents}   = undef;
        return undef;
    }
    $voice->{replies}       = $c->forward('replies');
    $voice->{favorites}     = $c->forward('favorites');
    $c->stash->{contents}   = $voice;
    return $voice;
}

sub favorites :Local { 
    my ( $self, $c ) = @_;

    my $mixi = $c->forward('/mixi');
    my $favorite_list_ref;
    eval {
        $favorite_list_ref = $mixi->voice->favorites(
            post_id => $c->req->param('post_id'),
        )->get->as_hashref;
    };

    $c->stash->{contents} = $favorite_list_ref || [];
    return $favorite_list_ref || [];
}

sub replies :Local {
    my ( $self, $c ) = @_;

    my $mixi = $c->forward('/mixi');
    my $replies_list_ref;
    eval {
        $replies_list_ref = $mixi->voice->replies(
            post_id => $c->req->param('post_id'),
        )->get->as_hashref;
    };
    
    $c->stash->{contents} = $replies_list_ref || [];
    return $replies_list_ref || [];
}

sub end : Private {
    my ( $self, $c ) = @_;

    #$c->cache->set(
    #    $c->action->reverse.$c->session->{friend_id}.$c->sessionid,
    #    $c->stash->{contents} || '',
    #    600,
    #);
    $c->forward('View::JSON');
}
# userが公開設定にしたかどうか
__PACKAGE__->meta->make_immutable;

1;
