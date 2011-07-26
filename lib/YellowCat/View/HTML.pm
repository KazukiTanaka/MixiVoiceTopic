package YellowCat::View::HTML;

use strict;
use warnings;

use base 'Catalyst::View::TT';

__PACKAGE__->config(
    NCLUDE_PATH => [
          YellowCat->path_to( 'root' ),
    ],
    TEMPLATE_EXTENSION => '.tt',
    render_die => 1,
);

=head1 NAME

YellowCat::View::HTML - TT View for YellowCat

=head1 DESCRIPTION

TT View for YellowCat.

=head1 SEE ALSO

L<YellowCat>

=head1 AUTHOR

EC2 Default User

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
