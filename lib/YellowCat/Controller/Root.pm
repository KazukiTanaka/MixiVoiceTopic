package YellowCat::Controller::Root;
use Moose;
use namespace::autoclean;

use constant {
    CONSUMER_KEY    => '',
    CONSUMER_SECRET => '',
    REDIRECT_URI    => 'http://emerges.to/login',
};

use lib ("/home/ec2-user/work/Mixi/WWW--Mixi--Graph/lib");

use Encode qw//;
use Mixi::Graph;
use Exception::Class;
use Data::Dumper;

BEGIN { extends 'Catalyst::Controller' }

__PACKAGE__->config(namespace => '');

sub auto :Private {
    my ($self, $c) = @_;
    if ( !$c->req->param('oauth_mixi') && !$c->sessionid ) {
        $c->req->action(undef);
        $c->forward('/about');
        return 1;
    }
    return 1 if ($c->action->reverse eq 'login');

    unless ($c->session->{code}) {
        my $mixi = Mixi::Graph->new(
            client_id       => CONSUMER_KEY,
            client_secret   => CONSUMER_SECRET,
            redirect_uri    => REDIRECT_URI,
        );
        $c->log->debug($c->req->param('id'));
        my $auth = $mixi->authorize(
            state   => $c->req->param('id') || '',
            display => 'touch',
        );

        $c->res->redirect(
            $auth->extend_permissions(qw/ r_profile r_voice w_voice /)->uri_as_string
        );
        $c->log->debug('after redirect');
        return 0;
    }

    unless ($c->req->param('id')) {
        $c->session->{friend_displayName}   = '';
        $c->session->{friend_thumbnailUrl}  = '';
        $c->session->{friend_id}            = '';
        return 1;
    }

    if ($c->req->param('id')) {
        my $friend_id = $c->req->param('id');
        my $mixi = $c->forward('/mixi');
        my $friend_profile;
        eval {
            $friend_profile = $mixi->people(
                user_id  => $friend_id,
                group_id => '@self',
            )->get->as_hashref;
        };

        if ($friend_profile && !Exception::Class->caught('Mixi::Graph::Exception::RPC')) {
            $c->session->{friend_displayName}   = Encode::encode('utf-8', $friend_profile->{entry}{displayName});
            $c->session->{friend_thumbnailUrl}  = $friend_profile->{entry}{thumbnailUrl};
            $c->session->{friend_id}            = $friend_id;
        }
        else {
            $c->session->{friend_displayName}   = '';
            $c->session->{friend_thumbnailUrl}  = '';
            $c->session->{friend_id}            = '';
        }
    }
    return 1;
}

sub index :Path :Args(0) {
    my ( $self, $c ) = @_;
    my $cache_key = sprintf('VOICE:POST:STATUSES:%s',
        ($c->session->{friend_id}) ? $c->session->{friend_id} : $c->session->{id},
    );
    $c->stash->{thumbnailUrl}   = $c->session->{friend_thumbnailUrl} || $c->session->{thumbnailUrl};
    $c->stash->{displayName}    = $c->session->{friend_displayName}  || $c->session->{displayName};
    $c->stash->{userName}       = $c->session->{displayName};
    $c->stash->{friend_id}      = $c->session->{friend_id};
    $c->stash->{status_id}      = $c->cache->get($cache_key) || '';
    $c->stash->{my_url}         = 'http://emerges.to/?id='.$c->session->{id};
    $c->stash->{my_id}          = $c->session->{id};
    $c->stash->{my_thumbnailUrl}= $c->session->{thumbnailUrl};
    $c->stash->{template}       = 'index.tt';
}

sub about :Local {
    my ( $self, $c ) = @_;
    $c->stash->{id}         = $c->req->param('id') || '';
    $c->stash->{template}   = 'about.tt';
}

sub login :Local {
    my ($self, $c) = @_;
    if ($c->req->param('error')) {
        $c->delete_session('not allow mixi oauth');
        $c->res->redirect('/about');
        return 0;
    }

    if ($c->session->{code}) {
        $c->res->redirect('/');
        return 0;
    }
    $c->session->{code} = $c->req->param('code');
    my $mixi = $c->forward('/mixi');
    my $my_profile;
    eval {
        $my_profile = $mixi->people(
            user_id  => '@me',
            group_id => '@self',
        )->get->as_hashref;
    };
    $c->session->{id}           = $my_profile->{entry}{id};
    $c->session->{displayName}  = Encode::encode('utf-8', $my_profile->{entry}{displayName});
    $c->session->{thumbnailUrl} = $my_profile->{entry}{thumbnailUrl};
    $c->session->{friend_id}    = '';
    my $redirect_uri = ($c->req->param('state')) ? '/?id='.$c->req->param('state') : '/';
    $c->res->redirect($redirect_uri);
    return 0;
}

sub logout :Local {
    my ($self, $c) = @_;
    $c->delete_session('logout by user');
    $c->res->redirect('/about');
    return 0;
}

sub mixi :Private {
    my ( $self, $c ) = @_;
    my $mixi = $self->{mixi} ||= Mixi::Graph->new(
        client_id       => CONSUMER_KEY,
        client_secret   => CONSUMER_SECRET,
        redirect_uri    => REDIRECT_URI,
    );

    if (my $access_token = $c->cache->get('MIXI:ACCESSTOKEN:'.$c->sessionid)) {
        $mixi->access_token($access_token);
        $mixi->refresh_token($c->session->{refresh_token});
        return $mixi;
    }

    if ($c->session->{refresh_token}) {
        eval {
            $mixi->refresh_access_token($c->session->{refresh_token});
        };
    }
    else {
        eval {
            $mixi->request_access_token($c->session->{code});
        };
    }
    if (Exception::Class->caught('Mixi::Graph::Exception::RPC')) {
        $c->delete_session('error code -> logout');
        $c->res->redirect('/');
        return 0;
    }

    $c->cache->set(
        'MIXI:ACCESSTOKEN:'.$c->sessionid,
        $mixi->access_token,
        $mixi->expires_in - 60,
    );

    $c->session->{access_token}     = $mixi->access_token;
    $c->session->{refresh_token}    = $mixi->refresh_token;
    return $mixi;
}

=head2 default

Standard 404 error page

=cut

sub default :Path {
    my ( $self, $c ) = @_;
    $c->response->body( 'Page not found' );
    $c->response->status(404);
}

sub end : Private {
    my ( $self, $c ) = @_;

    $c->forward( 'YellowCat::View::HTML' ) 
      unless ( $c->res->body || !$c->stash->{template} );
    warn 'forward' unless ( $c->res->body || !$c->stash->{template} );
}
__PACKAGE__->meta->make_immutable;

1;
