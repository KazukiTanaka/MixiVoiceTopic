#!/usr/bin/env perl
use strict;
use warnings;
use lib ("/home/ec2-user/web/YellowCat/lib");
use YellowCat;
use Log::Dispatch;
use Plack::Builder;

YellowCat->setup_engine('PSGI');
my $app = sub { YellowCat->run(@_) };

builder {
    my $logger = Log::Dispatch->new(
        outputs => [
            [
                'File',
                min_level => 'debug',
                filename  => '/tmp/top10.log'
            ],
        ],
    );
    enable "Plack::Middleware::AccessLog",
        logger => sub { $logger->log( level => 'debug', message => @_ ) };

    enable 'Expires',
        content_type    => [ 'text/css', 'application/javascript', qr!^image/! ],
        expires         => 'M3600';
    enable "Plack::Middleware::Static",
        path => qr{^/(?:favicon\.ico)|(?:static/(?:images|js|css)/)},
        root => './root';
    return $app;
};
