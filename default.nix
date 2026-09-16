{ pkgs ? import<nixpkgs> {}}:
pkgs.stdenv.mkDerivation {
  pname = "Pyxis";
  version = "0.0.2-beta";

  src = ./src-tauri/target/release/bundle/deb/Pyxis_0.1.0_amd64.deb;

  nativeBuildInputs = [ pkgs.dpkg pkgs.autoPatchelfHook ];

  # Unpack the debian archive
  unpackPhase = ''
    dpkg-deb --fsys-tarfile $src | tar -x --no-same-owner
    '';

  # Move the unpacked files to the output directory
  installPhase = ''
    mkdir -p $out
    cp -r . $out

    # Move desktop files where launchers expect them
    if [ -d "$out/usr/share/applications" ]; then
    mkdir -p $out/share
    mv $out/usr/share/applications $out/share/
    fi

    # Expose binaries
    if [ -d "$out/usr/bin" ]; then
    mkdir -p $out/bin
    ln -s $out/usr/bin/* $out/bin/
    fi'';


  # Use autoPatchelfHook to automatically fix binary links
  buildInputs = with pkgs; [
    at-spi2-atk
    atkmm
    cairo
    gdk-pixbuf
    glib
    gtk3
    harfbuzz
    librsvg
    libsoup_3
    pango
    webkitgtk_4_1
    openssl
  ];
}

