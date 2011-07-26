package YellowCat;
use Moose;
use namespace::autoclean;

use Catalyst::Runtime 5.80;

# Set flags and add plugins for the application.
#
# Note tchat ORDERING IS IMPORTANT here as plugins are initialized in order,
# therefore you almost certainly want to keep ConfigLoader at the head of the
# list if you're using it.
#
#         -Debug: activates the debug mode for very useful log messages
#   ConfigLoader: will load the configuration from a Config::General file in the
#                 application's home directory
# Static::Simple: will serve static files from the application's root
#                 directory

use Catalyst qw/
    ConfigLoader
    Session
    Session::Store::Memcached::Fast
    Session::State::Cookie
    Cache::Memcached::Fast
    HTML::Scrubber
/;

extends 'Catalyst';

our $VERSION = '0.01';

# Configure the application.
#
# Note that settings in yellowcat.conf (or other external
# configuration file that you set up manually) take precedence
# over this when using ConfigLoader. Thus configuration
# details given here can function as a default configuration,
# with an external configuration file acting as an override for
# local deployment.

__PACKAGE__->config(
    name => 'YellowCat',
    # Disable deprecated behavior needed by old applications
    disable_component_resolution_regex_fallback => 1,
    'Plugin::Session' => {
        expires             => 1800,
#        verify_user_agent   => 1,
    },
    cache => {
        servers     => [qw/127.0.0.1:11212/],
        namespace   => 'YellowCat:Cache:',
    },
    session => {
        expires     => 1800,
        servers     => [qw/127.0.0.1:11212/],
        namespace   => 'YellowCat:Session:',
    },
    scrubber => [
        default => 0,
        comment => 0,
        script => 0,
        process => 0,
    ],
);

# Start the application
__PACKAGE__->setup();


=head1 NAME

YellowCat - Catalyst based application

=head1 SYNOPSIS

    script/yellowcat_server.pl

=head1 DESCRIPTION

[enter your description here]

=head1 SEE ALSO

L<YellowCat::Controller::Root>, L<Catalyst>

=head1 AUTHOR

EC2 Default User

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
