export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        /*
         * API : récupérer le document
         */
        if (
            request.method === "GET" &&
            url.pathname === "/api/document"
        ) {
            const document = await env.DB
                .prepare(
                    "SELECT content, updated_at FROM documents WHERE id = 1"
                )
                .first();

            return Response.json({
                content: document?.content || "",
                updated_at: document?.updated_at || null
            });
        }

        /*
         * API : enregistrer le document
         */
        if (
            request.method === "PUT" &&
            url.pathname === "/api/document"
        ) {
            try {
                const body = await request.json();

                if (
                    !body ||
                    typeof body.content !== "string"
                ) {
                    return Response.json(
                        {
                            error: "Contenu invalide"
                        },
                        {
                            status: 400
                        }
                    );
                }

                await env.DB
                    .prepare(
                        `
                        INSERT INTO documents
                            (id, content, updated_at)
                        VALUES
                            (1, ?, datetime('now'))
                        ON CONFLICT(id)
                        DO UPDATE SET
                            content = excluded.content,
                            updated_at = excluded.updated_at
                        `
                    )
                    .bind(body.content)
                    .run();

                return Response.json({
                    success: true
                });
            } catch (error) {
                console.error(error);

                return Response.json(
                    {
                        error: "Erreur serveur"
                    },
                    {
                        status: 500
                    }
                );
            }
        }

        /*
         * Fichiers statiques
         */
        return env.ASSETS.fetch(request);
    }
};