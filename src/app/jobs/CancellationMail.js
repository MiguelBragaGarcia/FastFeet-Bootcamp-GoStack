import Mail from '../../lib/Mail';

class CancellationMail {
    get key() {
        return 'CancellationMail';
    }

    async handle({ data }) {
        const { cancelOrder } = data;
        console.log('A fila executou');
        await Mail.sendMail({
            to: `${cancelOrder.deliveryman.name}<${cancelOrder.deliveryman.email}`,
            subject: 'Uma encomenda foi cancelada',
            template: 'cancellation',
            context: {
                deliveryman_name: cancelOrder.deliveryman.nome,
                client_product: cancelOrder.product,
            },
        });
    }
}

export default new CancellationMail();
